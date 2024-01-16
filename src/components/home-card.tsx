import {
  Card,
  CardHeader,
  CardFooter,
  Button,
  Link,
  useDisclosure,
  Modal,
  Input,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { Data, Sbiller } from "../App";
import compareDate from "../libs/compareDate";
import { useState } from "react";
import { TagsInput } from "react-tag-input-component";
import { HiMiniPencilSquare } from "react-icons/hi2";
import linkString from "../libs/tohash";
import DeleteItem from "./home-card-delete";

type Props = {
  index: number;
  data: Data;
  setData: React.Dispatch<React.SetStateAction<Sbiller>>;
};

export default function HomeCard({ index, data, setData }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [tempName, setTempName] = useState(data.event_name);
  const [tempPerson, setTempPerson] = useState(data.persons);
  const [error, setError] = useState<string | null>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleTagChange = (tags: string[]) => {
    setTempPerson(tags);
  };

  const submitData = (onClose: () => void) => {
    setData((value) => {
      if (
        value.data.filter(
          (value, i) => value.id === linkString(tempName) && i !== index
        ).length !== 0
      ) {
        setError("Trip name already exist!");
        return value;
      }

      setError(null);
      value.data.sort(compareDate).splice(index, 1);
      onClose();
      setTempName(data.event_name);

      return {
        ...value,
        data: [
          ...value.data,
          {
            event_name: tempName,
            id: linkString(tempName),
            edited_at: new Date().toISOString(),
            persons: tempPerson,
            data:
              JSON.stringify(data.persons) !== JSON.stringify(tempPerson)
                ? []
                : data.data,
          } as Data,
        ],
      };
    });
  };

  return (
    <>
      <Card className="py-4 w-full" shadow="sm">
        <CardHeader className="pb-4 px-4 flex-col items-start gap-3">
          <h4 className="font-bold text-xl">📍 {data.event_name}</h4>
          <p className="text-sm pl-2 opacity-55">{data.persons.toString()}</p>
        </CardHeader>
        <CardFooter className="flex gap-2 px-6 justify-between">
          <Button
            className="text-sm font-semibold"
            variant="faded"
            radius="md"
            size="md"
            as={Link}
            href={`/${data.id}`}
          >
            Detail
          </Button>
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
            <DeleteItem setData={setData} index={index} />
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
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  submitData(onClose);
                }
              }}
            >
              <ModalHeader className="flex flex-col gap-1 text-xl font-bold">
                🏞️ Change Trip Information
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  variant="bordered"
                  type="text"
                  name="event_name"
                  label="Trip Name"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  labelPlacement="outside"
                  placeholder="Change your trip name"
                />
                <div>
                  <p className="text-sm">Persons on trip</p>
                  <p className="text-sm mb-1 text-danger">
                    Changing this will delete all data in this trip!
                  </p>
                  <TagsInput
                    value={tempPerson}
                    onChange={handleTagChange}
                    placeHolder="Press SPACE to add"
                    onKeyUp={(e) => {
                      if (e.key === "Enter") {
                        submitData(onClose);
                      }
                    }}
                    separators={[" "]}
                    classNames={{
                      input: "text-sm bg-transparent",
                      tag: "bg-success text-black text-sm pl-2",
                    }}
                  />
                </div>
                {error && <p className="text-danger">Error: {error}</p>}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="success"
                  onPress={() => {
                    submitData(onClose);
                  }}
                  className="font-medium"
                >
                  Edit Trip
                </Button>
              </ModalFooter>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
