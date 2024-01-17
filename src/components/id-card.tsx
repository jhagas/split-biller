import {
  Card,
  CardHeader,
  CardFooter,
  Button,
  useDisclosure,
  Autocomplete,
  AutocompleteItem,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Checkbox,
} from "@nextui-org/react";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { Data, Expense, Sbiller } from "../App";
import DeleteItem from "./id-card-delete";
import { useEffect, useState } from "react";
import linkString from "../libs/tohash";
import Twemoji from "./twemoji";

type Props = {
  index: number;
  expense: Expense;
  setData: React.Dispatch<React.SetStateAction<Sbiller>>;
  id: string;
  persons: string[];
};

export default function IdCard({
  index,
  expense,
  setData,
  id,
  persons,
}: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [error, setError] = useState<string | null>();
  const [all, setAll] = useState(false);
  const [includePayer, setIncludePayer] = useState(false);
  const [tempData, setTempData] = useState<Expense>(expense);

  const bailer = tempData.bailer;

  useEffect(() => {
    const set1 = new Set(persons);
    const set2 = new Set(expense.to);

    const difference = new Set(set1);
    for (const element of set2) {
      difference.delete(element);
    }

    if (difference.size === 0) setAll(true);
    if (set1.has(expense.bailer)) setIncludePayer(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIncludePayer(all);
  }, [all]);

  useEffect(() => {
    const persons2 = [...persons];
    if (all) {
      const index = persons2.indexOf(bailer);

      if (!includePayer && index !== -1) {
        persons2.splice(index, 1);
      } else if (includePayer && index === 1) {
        persons2.splice(index, 1);
        persons2.unshift(bailer);
      }
      setTempData((values) => ({
        ...values,
        to: persons2,
      }));
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
    }));
  };

  const submitData = (onClose: () => void) => {
    setData((value) => {
      if (tempData.to?.length == undefined) {
        setError("Input must not be empty");
        return value;
      }

      const persons2 = new Set();

      for (let i = 0; i < tempData.to.length; i++) {
        const v = tempData.to[i];

        if (v !== "" && persons.includes(v)) {
          persons2.add(v);
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
        persons2.size < 1;
      if (condition) {
        setError("Input must not be empty and must be at least 1 borrower");
        return value;
      }
      const pos = value.data.map((e) => e.id).indexOf(linkString(id));

      const pos2 = value.data[pos].data
        .map((e) => e.issued_at)
        .indexOf(expense.issued_at);

      const removed = value.data.splice(pos, 1);
      removed[0].data.splice(pos2, 1);
      onClose();
      setTempData(expense);

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
                issued_at: expense.issued_at,
                bailer: tempData.bailer,
                value: tempData.value,
                to: [...persons2],
              },
            ],
          } as Data,
        ],
      };
    });
  };

  const money = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  return (
    <>
      <Card className="py-4 w-full" shadow="sm">
        <CardHeader className="pb-4 px-4 flex-col items-start gap-1">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Twemoji emoji="💵" className="inline w-5" />
            <h3>{expense.name}</h3>
          </div>
          <p className="text-tiny mb-2 opacity-55">
            Issued at {new Date(expense.issued_at).toLocaleString("id")}
          </p>
          <h4 className="font-bold text-4xl text-success-600 dark:text-success-400">
            {money.format(expense.value)}
          </h4>
          <p className="text-sm opacity-55">
            Paid by {expense.bailer} for {expense.to.join(", ")}
          </p>
        </CardHeader>
        <CardFooter className="flex gap-2 px-6 justify-end">
          <div className="flex gap-2">
            <Button
              isIconOnly
              onPress={onOpen}
              variant="flat"
              color="default"
              radius="md"
              size="md"
            >
              <HiMiniPencilSquare size={17} />
            </Button>
            <DeleteItem
              setData={setData}
              index={index}
              id={id}
              issued_at={expense.issued_at}
            />
          </div>
        </CardFooter>
      </Card>

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
              <div className="flex items-center gap-2 text-xl font-bold">
                  <Twemoji emoji="💰" className="inline w-5" />
                  <h3>Edit Expense Information</h3>
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
                  {persons.map((item) => (
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
                    setTempData(expense);
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
                  Edit Expense
                </Button>
              </ModalFooter>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
