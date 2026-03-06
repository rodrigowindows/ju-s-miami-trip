/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Redefinir sua senha — AjuVaiParaMiami</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src="https://aleenmfaugxymtxqlyyz.supabase.co/storage/v1/object/public/email-assets/logo.svg" width="48" height="48" alt="AjuVaiParaMiami" style={{ margin: '0 0 20px' }} />
        <Heading style={h1}>Esqueceu sua senha?</Heading>
        <Text style={text}>
          Recebemos um pedido para redefinir a senha da sua conta na AjuVaiParaMiami.
          Clique no botão abaixo para escolher uma nova senha.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Redefinir minha senha
        </Button>
        <Text style={footer}>
          Se você não solicitou a redefinição, pode ignorar este e-mail. Sua senha não será alterada.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Roboto', Arial, sans-serif" }
const container = { padding: '30px 25px' }
const h1 = {
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: '#171717',
  margin: '0 0 20px',
}
const text = {
  fontSize: '14px',
  color: '#55575d',
  lineHeight: '1.6',
  margin: '0 0 25px',
}
const button = {
  backgroundColor: '#E8621A',
  color: '#FFF5E6',
  fontSize: '14px',
  fontWeight: 'bold' as const,
  borderRadius: '12px',
  padding: '12px 24px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
