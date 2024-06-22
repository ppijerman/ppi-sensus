import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export interface TestMailDevProps {
  recipientName: string;
}

export const TestMailDev = ({ recipientName }: TestMailDevProps) => {
  return (
    <Html>
      <Head />
      <Preview>Test Email</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={title}>Hello {recipientName},</Text>
            <Text style={text}>I love you.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f4f4f4",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "40px",
  borderRadius: "8px",
  overflow: "hidden",
  width: "480px",
  margin: "0 auto",
};

const title = {
  fontSize: "28px",
  fontWeight: "800",
  fontFamily:
    "'Albert Sans', BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  lineHeight: "34px",
  color: "#333333",
  marginBottom: "20px",
};

const text = {
  fontSize: "16px",
  fontFamily:
    "'Albert Sans', BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  lineHeight: "22px",
  color: "#333333",
  marginBottom: "20px",
};
