import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { FaCalculator } from "react-icons/fa6";
import { Data } from "../App";

type Props = {
  data: Data;
};

export default function CalculateExpenses({ data }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const arr = [] as string[][];

  for (let j = 0; j < data.data.length; j++) {
    const d = data.data[j];

    for (let i = 0; i < data.persons.length; i++) {
      if (data.persons[i] === d.bailer) continue;

      arr.push([
        data.persons[i],
        ">",
        d.bailer,
        `${d.value / data.persons.length}`,
      ]);
    }
  }

  const sorted = [] as string[];

  for (let i = 0; i < arr.length; i++) {
    const nama1 = arr[i][0];
    const nama2 = arr[i][2];
    let value = 0;

    for (let j = 0; j < arr.length; j++) {
      if (nama1 === arr[j][0] && nama2 === arr[j][2]) {
        value += +arr[j][3];
        arr.splice(j, 1);
        j--;
      } else if (nama1 === arr[j][2] && nama2 === arr[j][0]) {
        value += -1 * +arr[j][3];
        arr.splice(j, 1);
        j--;
      }
    }
    i--;

    if (value < 0) {
      value = -value;
      sorted.push(
        `${nama2} Ke ${nama1} bayar Rp ${value.toLocaleString("id-ID", {
          maximumFractionDigits: 2,
        })}`
      );
    } else {
      sorted.push(
        `${nama1} Ke ${nama2} bayar Rp ${value.toLocaleString("id-ID", {
          maximumFractionDigits: 2,
        })}`
      );
    }
  }

  return (
    <>
      <Button
        onPress={onOpen}
        color="success"
        size="md"
        variant="flat"
        className="font-medium text-success-600 dark:text-success-400 w-full"
      >
        <FaCalculator size={14} />
        Calculate Expenses
      </Button>
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
            <div>
              <ModalHeader className="flex flex-col gap-1 text-xl font-bold">
                Expenses Calculation
              </ModalHeader>
              <ModalBody>
                <div>
                  {sorted.map((d, i) => (
                    <p key={i}>{d}</p>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="success" variant="light" onPress={onClose}>
                  Okay
                </Button>
              </ModalFooter>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
