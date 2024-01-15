import { useParams } from "react-router-dom";
import { Data, Sbiller } from "../App";

type Props = {
  data: Data[];
  setData: React.Dispatch<React.SetStateAction<Sbiller>>;
};

export default function Id({ data, setData }: Props) {
  const { id } = useParams();
  const data_id = data.filter((value) => value.id === id);

  if (data_id.length === 0) {
    return <p className="text-default-foreground">Route Not Found!</p>;
  }

  return (
    <section className="dark:text-white text-zinc-950 py-10 px-4">
      <div className="my-6 pl-7 flex flex-col gap-2">
        <p className="text-6xl">🧭</p>
        <h1 className="text-4xl font-extrabold">
          {data_id[0].event_name}
        </h1>
        <p className="text-sm opacity-65">{data_id[0].persons.toLocaleString()}</p>
      </div>
    </section>
  );
}
