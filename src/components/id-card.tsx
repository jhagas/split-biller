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
} from "@nextui-org/react";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { Data, Expense, Sbiller } from "../App";
import DeleteItem from "./id-card-delete";
import { useState } from "react";
import linkString from "../libs/tohash";

type Props = {
  index: number;
  expense: Expense;
  setData: React.Dispatch<React.SetStateAction<Sbiller>>;
  id: string;
  persons: string[];
};

export default function IdCard({ index, expense, setData, id, persons }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [tempData, setTempData] = useState<Expense>(expense);

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
      const pos = value.data.map((e) => e.id).indexOf(linkString(id));

      const pos2 = value.data[pos].data
        .map((e) => e.issued_at)
        .indexOf(expense.issued_at);

      const removed = value.data.splice(pos, 1);
      removed[0].data.splice(pos2, 1);
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

  return (
    <>
      <Card className="py-4 w-full" shadow="sm">
        <CardHeader className="pb-4 px-4 flex-col items-start gap-1">
          <h4 className="font-medium text-lg">💵 {expense.name}</h4>
          <p className="text-sm opacity-55">Paid by {expense.bailer}</p>
          <h4 className="font-bold text-4xl text-success-600 dark:text-success-400">
            Rp {expense.value.toLocaleString("id-ID")}
          </h4>
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
                  {persons.map((item) => (
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
