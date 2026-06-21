import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#9333ea",
        borderRadius: "6px",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="20"
        height="20"
      >
        <path d="M12 2v6" />
        <path d="M8 2h8" />
        <path d="M9 8h6l1 10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2L9 8z" />
      </svg>
    </div>,
    { ...size }
  );
}
