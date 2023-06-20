package main

import (
	"encoding/json"
	"fmt"
	"sync"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/rodolfoHOk/fullcycle.imersao13/ms-bolsa-simulator/internal/infra/kafka"
	"github.com/rodolfoHOk/fullcycle.imersao13/ms-bolsa-simulator/internal/market/dto"
	"github.com/rodolfoHOk/fullcycle.imersao13/ms-bolsa-simulator/internal/market/entity"
	"github.com/rodolfoHOk/fullcycle.imersao13/ms-bolsa-simulator/internal/market/transformer"
)

func main() {
	ordersIn := make(chan *entity.Order)
	ordersOut := make(chan *entity.Order)
	wg := &sync.WaitGroup{}
	defer wg.Wait()

	kafkaMsgChain := make(chan *ckafka.Message)
	configMap := &ckafka.ConfigMap{
		"bootstrap.servers": "host.docker.internal:9094",
		"group.id": "myGroup",
		"auto.offset.reset": "latest", // "earliest" desde o começo "latest" a partir de quando programa rodar 
	}
	kafkaProducer := kafka.NewKafkaProducer(configMap)
	kafkaConsumer := kafka.NewKafkaConsumer(configMap, []string{"input"})

	go kafkaConsumer.Consume(kafkaMsgChain)

	book := entity.NewBook(ordersIn, ordersOut, wg)

	go book.Trade()

	go func() {
		for msg := range kafkaMsgChain {
			wg.Add(1)
			fmt.Println(string(msg.Value))
			tradeInput := dto.TradeInput{}
			err := json.Unmarshal(msg.Value, &tradeInput)
			if err != nil {
				panic(err)
			}
			order := transformer.TransformInput(tradeInput)
			ordersIn <- order
		}
	}()

	for res := range ordersOut {
		output := transformer.TransformeOutput(*res)
		outputJson, err := json.MarshalIndent(output, "", "   ")
		fmt.Println(string(outputJson))
		if err != nil {
			fmt.Println(err)
		}
		err = kafkaProducer.Publish(outputJson, []byte("orders"), "output")
		if err != nil {
			fmt.Println(err)
		}
	}
}
