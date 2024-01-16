import { useParams } from "react-router-dom";
import { Data, Expense, Sbiller } from "../App";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { FaRupiahSign } from "react-icons/fa6";
import { useState } from "react";
import linkString from "../libs/tohash";
import IdCard from "../components/id-card";
import CalculateExpenses from "../components/id-card-calculate";

type Props = {
  data: Data[];
  setData: React.Dispatch<React.SetStateAction<Sbiller>>;
};

export default function Id({ data, setData }: Props) {
  const { id } = useParams();
  const [tempData, setTempData] = useState<Expense>({} as Expense);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [error, setError] = useState<string | null>();
  const data_id = data.filter((value) => value.id === id);

  const handleChange = (event: { target: { name: string; value: string } }) => {
    const name = event.target.name;
    const value = event.target.value;
    setTempData((values) => ({
      ...values,
      [name]: value,
      value: name === "value" ? +value : values.value,
      issued_at: new Date().toISOString(),
    }));
  };

  const submitData = (onClose: () => void) => {
    setData((value) => {
      const condition =
        tempData.name == "" ||
        tempData.name == null ||
        tempData.name == undefined ||
        tempData.bailer == "" ||
        tempData.bailer == null ||
        tempData.bailer == undefined ||
        tempData.value == 0 ||
        tempData.value == null ||
        tempData.value == undefined;
      if (condition) {
        setError("Input must not be empty");
        return value;
      }
      const pos = value.data
        .map((e) => e.id)
        .indexOf(linkString(data_id[0].id));

      const removed = value.data.splice(pos, 1);
      onClose();
      setTempData({} as Expense);

      return {
        ...value,
        data: [
          ...value.data,
          {
            ...removed[0],
            edited_at: new Date().toISOString(),
            data: [
              ...removed[0].data,
              {
                name: tempData.name,
                issued_at: new Date().toISOString(),
                bailer: tempData.bailer,
                value: tempData.value,
              },
            ],
          } as Data,
        ],
      };
    });
  };

  if (data_id.length === 0) {
    return <p className="text-default-foreground">Route Not Found!</p>;
  }

  return (
    <>
      <section className="dark:text-white text-zinc-950 py-10 px-7">
        <div className="my-6 flex flex-col gap-2">
          <p className="text-6xl">🧭</p>
          <h1 className="text-4xl font-extrabold">{data_id[0].event_name}</h1>
          <p className="text-sm opacity-65">
            {data_id[0].persons.toLocaleString()}
          </p>
        </div>

        {data_id[0].data.length !== 0 && (
          <CalculateExpenses data={data_id[0]} />
        )}
        <Button
          onPress={onOpen}
          color="success"
          size="md"
          variant="flat"
          className="font-medium text-success-600 dark:text-success-400 w-full mt-2"
        >
          <FaRupiahSign size={14} />
          Add Expense
        </Button>
        <div className="flex flex-col gap-4 mt-8">
          {data_id[0].data.length === 0 && (
            <p className="text-center text-lg font-semibold dark:text-white my-auto text-zinc-950">
              There is no expenses yet
            </p>
          )}
          {data_id[0].data
            .sort(
              (a, b) =>
                new Date(b.issued_at).getTime() -
                new Date(a.issued_at).getTime()
            )
            .map((d, i) => (
              <IdCard
                index={i}
                key={d.issued_at}
                expense={d}
                setData={setData}
                id={data_id[0].id}
                persons={data_id[0].persons}
              />
            ))}
        </div>
      </section>

      <Modal
        hideCloseButton
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        portalContainer={document.getElementById("main") as Element}
        classNames={{
          base: "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <div
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submitData(onClose);
                }
              }}
            >
              <ModalHeader className="flex flex-col gap-1 text-xl font-bold">
                💰 Expense Information
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  isRequired
                  variant="bordered"
                  type="text"
                  name="name"
                  label="Expense Name"
                  value={tempData.name ? tempData.name : ""}
                  onChange={handleChange}
                  labelPlacement="outside"
                  placeholder="Enter your expense name"
                />
                <Autocomplete
                  isRequired
                  variant="bordered"
                  labelPlacement="outside"
                  name="bailer"
                  selectedKey={tempData.bailer ? "" + tempData.bailer : ""}
                  onSelectionChange={(key) =>
                    setTempData((val) => ({ ...val, bailer: key } as Expense))
                  }
                  label="Who pays this?"
                  placeholder="Enter the bailer"
                >
                  {data_id[0].persons.map((item) => (
                    <AutocompleteItem key={item}>{item}</AutocompleteItem>
                  ))}
                </Autocomplete>
                <Input
                  isRequired
                  variant="bordered"
                  type="number"
                  name="value"
                  label="Amount of Money"
                  value={tempData.value ? "" + tempData.value : ""}
                  onChange={handleChange}
                  labelPlacement="outside"
                  placeholder="Enter the amount of money"
                />
                {error && <p className="text-danger">Error: {error}</p>}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onClose();
                    setTempData({} as Expense);
                  }}
                >
                  Close
                </Button>
                <Button
                  color="success"
                  onPress={() => {
                    submitData(onClose);
                  }}
                  className="font-medium"
                >
                  Add Expense
                </Button>
              </ModalFooter>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
