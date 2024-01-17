import { useParams } from "react-router-dom";
import { Data, Expense, Sbiller } from "../App";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { FaRupiahSign } from "react-icons/fa6";
import { useEffect, useState } from "react";
import linkString from "../libs/tohash";
import IdCard from "../components/id-card";
import CalculateExpenses from "../components/id-card-calculate";
import Twemoji from "../components/twemoji";

type Props = {
  data: Data[];
  setData: React.Dispatch<React.SetStateAction<Sbiller>>;
};

export default function Id({ data, setData }: Props) {
  const { id } = useParams();
  const [all, setAll] = useState(false);
  const [includePayer, setIncludePayer] = useState(false);
  const [tempData, setTempData] = useState<Expense>({} as Expense);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [error, setError] = useState<string | null>();
  const data_id = data.filter((value) => value.id === id);

  const bailer = tempData.bailer;

  useEffect(() => {
    setAll(true);
    setIncludePayer(true);
  }, [isOpen]);

  useEffect(() => {
    setIncludePayer(all);
  }, [all]);

  useEffect(() => {
    if (data_id.length > 0) {
      const persons = [...data_id[0].persons];
      if (all) {
        const index = persons.indexOf(bailer);

        if (!includePayer && index !== -1) {
          persons.splice(index, 1);
        } else if (includePayer && index === 1) {
          persons.splice(index, 1);
          persons.unshift(bailer);
        }
        setTempData((values) => ({
          ...values,
          to: persons,
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, includePayer]);

  const handleChange = (event: { target: { name: string; value: string } }) => {
    const name = event.target.name;
    const value = event.target.value;

    const persons = [] as string[];

    if (name === "to") {
      value
        .split(",")
        .map((d) => d.trim())
        .forEach((v, i, a) => {
          if (v !== "" || i === a.length - 1) persons.push(v);
        });
    }

    setTempData((values) => ({
      ...values,
      [name]: value,
      to: name === "to" ? persons : values.to,
      value: name === "value" ? +value : values.value,
      issued_at: new Date().toISOString(),
    }));
  };

  const submitData = (onClose: () => void) => {
    setData((value) => {
      if (tempData.to?.length == undefined) {
        setError("Input must not be empty");
        return value;
      }

      const persons = new Set();

      for (let i = 0; i < tempData.to.length; i++) {
        const v = tempData.to[i];

        if (v !== "" && data_id[0].persons.includes(v)) {
          persons.add(v);
        } else {
          setError(`${v} don't exist on trip participants`);
          return value;
        }
      }

      const condition =
        tempData.name == "" ||
        tempData.name == null ||
        tempData.name == undefined ||
        tempData.bailer == "" ||
        tempData.bailer == null ||
        tempData.bailer == undefined ||
        tempData.value <= 0 ||
        tempData.value == null ||
        tempData.value == undefined ||
        persons.size < 1;
      if (condition) {
        setError("Input must not be empty and must be at least 1 borrower");
        return value;
      }
      const pos = value.data
        .map((e) => e.id)
        .indexOf(linkString(data_id[0].id));

      const removed = value.data.splice(pos, 1);
      onClose();
      setTempData({ ...{}, to: data_id[0].persons } as Expense);

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
                to: [...persons],
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
      <section className="dark:text-white text-zinc-950 py-10 px-5 max-w-[1024px] mx-auto">
        <div className="my-6 flex flex-col gap-2 ml-2">
          <Twemoji emoji="🧭" className="w-[3.75rem]" />
          <h1 className="text-4xl font-extrabold">{data_id[0].event_name}</h1>
          <p className="text-sm opacity-65">{data_id[0].persons.join(", ")}</p>
        </div>

        {data_id[0].data.length !== 0 && (
          <CalculateExpenses data={data_id[0].data} />
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
        placement="center"
        isDismissable={false}
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
                <div className="flex items-center gap-2 text-xl font-bold">
                  <Twemoji emoji="💰" className="inline w-5" />
                  <h3>Add Expense Information</h3>
                </div>
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
                <div className="flex flex-col gap-2">
                  <p className="text-sm after:content-['*'] after:text-danger after:ml-0.5">
                    Borrower (Separated with ",")
                  </p>
                  <Checkbox
                    isSelected={all}
                    onValueChange={(isSelected) => setAll(isSelected)}
                    color="success"
                  >
                    All participant
                  </Checkbox>
                  {all && (
                    <Checkbox
                      isSelected={includePayer}
                      onValueChange={(isSelected) =>
                        setIncludePayer(isSelected)
                      }
                      color="success"
                    >
                      Include payer?
                    </Checkbox>
                  )}
                  <Input
                    isRequired
                    disabled={all}
                    variant={all ? "flat" : "bordered"}
                    type="text"
                    name="to"
                    value={tempData.to?.join(", ").trim()}
                    onChange={handleChange}
                    labelPlacement="outside"
                    placeholder="Type the person's name"
                  />
                </div>
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
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">Rp</span>
                    </div>
                  }
                />
                {error && <p className="text-danger">Error: {error}</p>}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onClose();
                    setTempData({ ...{}, to: data_id[0].persons } as Expense);
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
