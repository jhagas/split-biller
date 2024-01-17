import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@nextui-org/react";
import { FaCalculator } from "react-icons/fa6";
import { Data } from "../App";
import Twemoji from "./twemoji";
import { LuCopy } from "react-icons/lu";
import { IoCheckmarkDone } from "react-icons/io5";
import { useEffect, useState } from "react";

type Props = {
  data: Data;
};

export default function CalculateExpenses({ data }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const money = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  const arr = [] as string[][];
  const arr2 = [
    "--------------------------\n-- Expenses Details\n--------------------------\n",
  ] as string[];

  for (let j = 0; j < data.data.length; j++) {
    const d = data.data[j];

    arr2.push(`-- ${d.name.toLocaleUpperCase()}, Bailer : ${d.bailer}`);
    arr2.push(`-- ${new Date(d.issued_at).toLocaleString("id")}`);

    for (let i = 0; i < d.to.length; i++) {
      if (d.to[i] === d.bailer) continue;

      arr.push([d.to[i], ">", d.bailer, `${d.value / d.to.length}`]);
      arr2.push(
        `${d.to[i]} has to pay ${d.value / d.to.length} to ${d.bailer}`
      );
    }

    arr2.push("");
  }

  arr2.push(
    "\n--------------------------\n-- Expenses Calculation\n--------------------------\n"
  );

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
      sorted.push(`${nama2} has to pay ${money.format(value)} to ${nama1}`);
    } else if (value > 0) {
      sorted.push(`${nama1} has to pay ${money.format(value)} to ${nama2}`);
    }
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    if (isPopoverOpen) {
      copyToClipboard(arr2.concat(sorted).join("\n"));
      const timer = setTimeout(() => {
        setIsPopoverOpen(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPopoverOpen]);

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
        isDismissable={false}
        placement="center"
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
                <div className="flex items-center gap-2 text-xl font-bold">
                  <Twemoji emoji="💹" className="inline w-5" />
                  <h3>Expenses Calculation</h3>
                </div>
              </ModalHeader>
              <ModalBody>
                <div>
                  {sorted.length === 0 && (
                    <p className="text-base">No one have to pay anything</p>
                  )}
                  {sorted.map((d, i) => (
                    <p className="text-base" key={i}>
                      {d}
                    </p>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Popover
                  isOpen={isPopoverOpen}
                  onOpenChange={(open) => setIsPopoverOpen(open)}
                  placement="left"
                  size="sm"
                >
                  <PopoverTrigger>
                    <Button color="success" variant="light" isIconOnly>
                      {isPopoverOpen ? (
                        <IoCheckmarkDone size={20} />
                      ) : (
                        <LuCopy size={15} />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2">
                      <div className="text-small">Details copied!</div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Button color="success" onPress={onClose}>
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
