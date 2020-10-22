import Page from "../components/Page";
import StatusField from "../components/StatusField";
import { useUser } from "../utils/userContext";

export default function Home() {
  const user = useUser();

  return (
    <Page>
      <div className="space-y-7">
        <h4 className="font-medium text-3xl">
          Hey, {user.nickname}
          {user.plus && <sup className="select-none text-primary">+</sup>}
        </h4>
        <StatusField />
      </div>
    </Page>
  );
}
