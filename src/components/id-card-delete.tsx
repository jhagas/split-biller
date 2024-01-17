import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Data, Sbiller } from "../App";
import { MdDelete } from "react-icons/md";
import linkString from "../libs/tohash";
import Twemoji from "./twemoji";

type Props = {
  setData: React.Dispatch<React.SetStateAction<Sbiller>>;
  index: number;
  id: string;
  issued_at: string;
};

export default function DeleteItem({ setData, id, issued_at }: Props) {
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
                  <h3>Delete Expense</h3>
                </div>
              </ModalHeader>
              <ModalBody>
                <p>Are you sure to delete this expense?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    setData((value) => {
                      const pos = value.data
                        .map((e) => e.id)
                        .indexOf(linkString(id));

                      const pos2 = value.data[pos].data
                        .map((e) => e.issued_at)
                        .indexOf(issued_at);

                      const removed = value.data.splice(pos, 1);
                      removed[0].data.splice(pos2, 1);

                      onClose();

                      return {
                        ...value,
                        data: [
                          ...value.data,
                          {
                            ...removed[0],
                            edited_at: new Date().toISOString(),
                            data: [...removed[0].data],
                          } as Data,
                        ],
                      };
                    });
                  }}
                  className="font-medium"
                >
                  Delete Expense
                </Button>
              </ModalFooter>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
