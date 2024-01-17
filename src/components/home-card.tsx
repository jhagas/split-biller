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
import { HiMiniPencilSquare } from "react-icons/hi2";
import linkString from "../libs/tohash";
import DeleteItem from "./home-card-delete";
import Twemoji from "./twemoji";

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
  const handleTagChange = (event: { target: { value: string } }) => {
    const persons = [] as string[];

    event.target.value
      .split(",")
      .map((d) => d.trim())
      .forEach((v, i, a) => {
        if (v !== "" || i === a.length - 1) persons.push(v);
      });

    setTempPerson(persons);
  };

  const submitData = (onClose: () => void) => {
    setData((value) => {
      if (tempPerson?.length == undefined) {
        setError("Input must not be empty");
        return value;
      }

      const persons = new Set();

      tempPerson.forEach((v) => {
        if (v !== "") persons.add(v);
      });

      const condition =
        tempName == "" ||
        tempName == null ||
        tempName == undefined ||
        persons.size < 2;

      if (condition) {
        setError(
          "Input must not be empty and participants must greater than 2"
        );
        return value;
      }
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
            persons: [...persons] as string[],
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
        <CardHeader className="pb-4 px-6 flex-col items-start gap-3">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Twemoji emoji="🌅" className="inline w-5" />
            <h3>{data.event_name}</h3>
          </div>
          <p className="text-sm opacity-55">{data.persons.join(", ")}</p>
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
                <div className="flex items-center gap-2 text-xl font-bold">
                  <Twemoji emoji="🏔️" className="inline w-5" />
                  <h3>Change Trip Information</h3>
                </div>
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
                  <p className="text-sm">Participants (separated by ",")</p>
                  <p className="text-sm mb-1 text-danger">
                    Changing this will delete all data in this trip!
                  </p>
                  <Input
                    isRequired
                    variant="bordered"
                    type="text"
                    name="persons"
                    value={tempPerson?.join(", ").trim()}
                    onChange={handleTagChange}
                    labelPlacement="outside"
                    placeholder="Type the person's name, separate with COMMA"
                  />
                </div>
                {error && <p className="text-danger">Error: {error}</p>}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onClose();
                    setTempName(data.event_name);
                    setTempPerson(data.persons);
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
