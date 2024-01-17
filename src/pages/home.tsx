import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Data, Sbiller } from "../App";
import { CiSquarePlus } from "react-icons/ci";
import { useState } from "react";
import HomeCard from "../components/home-card";
import compareDate from "../libs/compareDate";
import linkString from "../libs/tohash";
import Twemoji from "../components/twemoji";

type Props = {
  data: Data[];
  setData: React.Dispatch<React.SetStateAction<Sbiller>>;
};

export default function Home({ data, setData }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [tempData, setTempData] = useState<Data>({} as Data);
  const [error, setError] = useState<string | null>();

  const handleChange = (event: { target: { name: string; value: string } }) => {
    const name = event.target.name;
    const value = event.target.value;

    const persons = [] as string[];

    if (name === "persons") {
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
      id: name === "event_name" ? linkString(value) : values.id,
      persons: name === "persons" ? persons : values.persons,
      edited_at: new Date().toISOString(),
      data: [],
    }));
  };

  const submitData = (onClose: () => void) => {
    setData((value) => {
      if (tempData.persons?.length == undefined) {
        setError("Input must not be empty");
        return value;
      }

      const persons = new Set();

      tempData.persons.forEach((v) => {
        if (v !== "") persons.add(v);
      });

      const condition =
        tempData.event_name == "" ||
        tempData.event_name == null ||
        tempData.event_name == undefined ||
        persons.size < 2;
      if (condition) {
        setError("Input must not be empty and have at least 2 participants");
        return value;
      }

      if (
        value.data.filter(
          (value) => value.id === linkString(tempData.event_name)
        ).length !== 0
      ) {
        setError("Trip name already exist!");
        return value;
      }

      setError(null);
      onClose();
      setTempData({} as Data);
      return {
        ...value,
        data: [
          ...value.data,
          { ...tempData, persons: [...persons] as string[] },
        ],
      };
    });
  };

  return (
    <>
      <section className="w-full p-5 flex flex-col justify-center max-w-[1024px] mx-auto">
        <Button
          onPress={onOpen}
          color="success"
          size="lg"
          variant="flat"
          className="text-xl h-16 font-medium text-success-600 dark:text-success-400"
        >
          <CiSquarePlus size={40} />
          Add Trip
        </Button>

        <div className="flex flex-col mt-14 gap-4">
          {data.length === 0 && (
            <div className="max-w-sm mx-auto flex flex-col gap-6 mt-5">
              <Twemoji emoji="🚞" className="w-40 mx-auto" />
              <p className="text-center text-lg font-normal dark:text-white my-auto text-zinc-950">
                There is no trip yet, click <b>Add Trip</b> above to start your
                journey!
              </p>
            </div>
          )}
          {data.sort(compareDate).map((d, i) => (
            <HomeCard index={i} key={d.edited_at} data={d} setData={setData} />
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
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  submitData(onClose);
                }
              }}
            >
              <ModalHeader className="flex items-center gap-2 text-xl font-bold">
                <Twemoji emoji="🏞️" className="inline w-5" />
                <h3>Add Trip Information</h3>
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  isRequired
                  variant="bordered"
                  type="text"
                  name="event_name"
                  label="Trip Name"
                  value={tempData.event_name}
                  onChange={handleChange}
                  labelPlacement="outside"
                  placeholder="Enter your trip name"
                />
                <Input
                  isRequired
                  variant="bordered"
                  type="text"
                  name="persons"
                  label={`Participants (separated by ",")`}
                  value={tempData.persons?.join(", ").trim()}
                  onChange={handleChange}
                  labelPlacement="outside"
                  placeholder="Type the person's name"
                />
                {error && <p className="text-danger">Error: {error}</p>}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onClose();
                    setError(null);
                    setTempData({} as Data);
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
                  Add Trip
                </Button>
              </ModalFooter>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
