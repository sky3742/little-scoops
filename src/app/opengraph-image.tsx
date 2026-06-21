import { ImageResponse } from "next/og";

export const alt = "LittleScoops - Baby care tracker";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#fcfbfa",
        gap: "24px",
      }}
    >
      <div
        style={{
          width: "96px",
          height: "96px",
          borderRadius: "20px",
          background: "#9333ea",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="48"
          height="48"
        >
          <path d="M12 2v6" />
          <path d="M8 2h8" />
          <path d="M9 8h6l1 10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2L9 8z" />
        </svg>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontSize: "48px",
            fontWeight: 700,
            color: "#1a1a1a",
            fontFamily: "sans-serif",
          }}
        >
          LittleScoops
        </span>
        <span
          style={{
            fontSize: "24px",
            color: "#666",
            fontFamily: "sans-serif",
          }}
        >
          Track your baby&apos;s milk powder and diaper usage
        </span>
      </div>
    </div>,
    { ...size }
  );
}
