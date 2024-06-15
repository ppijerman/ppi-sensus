import { Body, Container, Head, Html, Preview, Section, Text } from "@react-email/components";

export interface EmailVerificationTemplateProps {
  verificationUrl: string;
}

export const EmailVerificationTemplate = ({ verificationUrl }: EmailVerificationTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>Konfirmasi Verifikasi Akun Pelajar</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={logoContainer}>
              <img
                src={imgSource}
                style={logo}
                alt="Logo PPI Jerman"
              />
            </Text>
            <Text style={title}>Konfirmasi Verifikasi Akun Pelajar</Text>
            <Text style={text}>
              Untuk verifikasi status pelajar anda di sensus PPI Jerman, klik tombol
              &quot;Konfirmasi Verifikasi Sensus&quot; dibawah ini. Link ini hanya berlaku dalam waktu
              <strong> 15 menit.</strong>
            </Text>
            <Text style={buttonContainer}>
              <a href={verificationUrl} style={button}>
                konfirmasi verifikasi sensus
              </a>
            </Text>
            <Text style={text}>
              Email ini dikirim oleh <strong>sensus.ppijerman.org</strong>
            </Text>
            <Text style={text}>
              Tidak mendaftar? Kontak kami di it@ppijerman.org
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const imgSource = "https://86672bac-a392-46b5-b043-36939e3615d6.b-cdn.net/e/a909c089-08fb-4dec-8ffa-add85225e99d/2770dafc-1e1e-4af6-917b-8e920b460772.png";

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

const logoContainer = {
  textAlign: "left" as const,
  paddingBottom: "20px",
};

const logo = {
  display: "block",
  border: 0,
  height: "55px",
  width: "55px",
};

const title = {
  fontSize: "28px",
  fontWeight: "800",
  fontFamily: "'Albert Sans', BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  lineHeight: "34px",
  color: "#333333",
  marginBottom: "20px",
};

const text = {
  fontSize: "16px",
  fontFamily: "'Albert Sans', BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  lineHeight: "22px",
  color: "#333333",
  marginBottom: "20px",
};

const buttonContainer = {
  textAlign: "left" as const,
  marginBottom: "35px",
};

const button = {
  backgroundColor: "#ebebeb",
  border: "1px solid #000",
  color: "#000",
  textDecoration: "none",
  padding: "10px 20px",
  borderRadius: "40px",
  textAlign: "center" as const,
  display: "inline-block",
  fontWeight: "900",
  textTransform: "uppercase" as const,
  fontSize: "16px",
  letterSpacing: "1px",
  fontFamily: "'Inter Tight', BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
};
