import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: 'us-east-1',
  endpoint: process.env.AWS_ENDPOINT,
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test'
  }
});

export const createOrder = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const total = body.total;
    console.log('Criando pedido com total:', total);

    const emailParams = {
      Source: 'no-reply@example.com',
      Destination: {
        ToAddresses: ['vitorhugo.pozzi@gmail.com']
      },
      Message: {
        Subject: { Data: 'Novo Pedido Criado' },
        Body: { 
          Text: { Data: `Um novo pedido foi criado com total: ${total}` } 
        }
      }
    };

    const sesResult = await sesClient.send(new SendEmailCommand(emailParams));
    console.log('Email enviado com sucesso:', sesResult);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Pedido criado e email enviado com sucesso',
      }),
    };
  } catch (error) {
    console.error('Erro ao criar pedido e enviar email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Erro interno ao criar pedido e enviar email', 
        error: error.message 
      }),
    };
  }
};
