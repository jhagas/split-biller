import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Sbiller } from "../App";
import compareDate from "../libs/compareDate";
import { MdDelete } from "react-icons/md";
import Twemoji from "./twemoji";

type Props = {
  setData: React.Dispatch<React.SetStateAction<Sbiller>>;
  index: number;
};

export default function DeleteItem({ setData, index }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        isIconOnly
        className="justify-items-end"
        variant="flat"
        color="danger"
        radius="md"
        size="md"
        onPress={onOpen}
      >
        <MdDelete size={17} />
      </Button>
      <Modal
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
                  <Twemoji emoji="🚮" className="inline w-5" />
                  <h3>Delete Trip</h3>
                </div>
              </ModalHeader>
              <ModalBody>
                <p>Are you sure to delete this Trip?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    setData((value) => {
                      value.data.sort(compareDate).splice(index, 1);

                      return {
                        ...value,
                        data: value.data,
                      };
                    });
                  }}
                  className="font-medium"
                >
                  Delete Trip
                </Button>
              </ModalFooter>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
