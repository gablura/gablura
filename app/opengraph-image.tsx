import { ImageResponse } from "next/og";

export const alt = "Gablura — Open source infrastructure for developers";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #818cf8, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#ffffff",
                display: "flex",
              }}
            >
              G
            </div>
          </div>
          <div
            style={{
              fontSize: "48px",
              fontWeight: 600,
              color: "#e4e4e7",
              letterSpacing: "-0.02em",
              display: "flex",
            }}
          >
            Gablura
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "52px",
            fontWeight: 600,
            color: "#e4e4e7",
            textAlign: "center",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            maxWidth: "900px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex" }}>Open source infrastructure</div>
          <div style={{ color: "#a1a1aa", display: "flex" }}>for developers</div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "22px",
            color: "#71717a",
            marginTop: "28px",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.4,
          }}
        >
          Packages · SDKs · Tools · Projects
        </div>

        {/* Pill badges */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "36px",
          }}
        >
          {["npm packages", "type-safe SDKs", "developer tools"].map(
            (label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 20px",
                  borderRadius: "9999px",
                  border: "1px solid #27272a",
                  background: "rgba(19,19,22,0.8)",
                  color: "#a1a1aa",
                  fontSize: "15px",
                  fontWeight: 500,
                }}
              >
                {label}
              </div>
            )
          )}
        </div>

        {/* Bottom URL */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 0",
            borderTop: "1px solid #18181b",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              color: "#52525b",
              fontWeight: 500,
              display: "flex",
            }}
          >
            gablura-org.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
