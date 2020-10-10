import Page from "../components/Page";
import ConfusedCat from "../components/ConfusedCat";
import Link from "next/link";

export default function NotFound() {
  return (
    <Page>
      <div>
        <h1 className="text-5xl font-medium">404</h1>
        <p>
          We're having trouble finding that page! Maybe go to the{" "}
          <Link href="/">
            <a className="text-primary">homepage</a>
          </Link>
          .
        </p>
      </div>

      <ConfusedCat />
    </Page>
  );
}
