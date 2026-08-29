import VerifyPage from "../page";

export function generateStaticParams() {
  return [
    { batchId: "1" },
    { batchId: "2" },
    { batchId: "3" },
  ];
}

export default function BatchVerifyPage() {
  return <VerifyPage />;
}
