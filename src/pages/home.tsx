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
import { TagsInput } from "react-tag-input-component";
import HomeCard from "../components/home-card";
import compareDate from "../libs/compareDate";
import linkString from "../libs/tohash";

type Props = {
  data: Data[];
  setData: React.Dispatch<React.SetStateAction<Sbiller>>;
};

export default function Home({ data, setData }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [tempData, setTempData] = useState<Data>({} as Data);

  const handleChange = (event: { target: { name: string; value: string } }) => {
    const name = event.target.name;
    const value = event.target.value;
    setTempData((values) => ({
      ...values,
      [name]: value,
      id: name === "event_name" ? linkString(value) : values.event_name,
      edited_at: new Date().toISOString(),
      data: [],
    }));
  };

  const submitData = () => {
    setData((value) => ({ ...value, data: [...value.data, tempData] }));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleTagChange = (tags: string[]) => {
    setTempData((values) => ({
      ...values,
      persons: tags,
      edited_at: new Date().toISOString(),
      data: [],
    }));
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

        <div className="flex flex-col gap-4 mt-8">
          {data.length === 0 && (
            <div className="flex justify-center items-center px-2" style={{
              minHeight: "calc(100vh - 4rem - 2.5rem - 8rem)"
            }}>
              <p className="text-center text-lg font-semibold dark:text-white my-auto text-zinc-950">
                There is no trip yet, click Add Trip above to start your
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onClose();
                  submitData();
                  setTempData({} as Data);
                }
              }}
            >
              <ModalHeader className="flex flex-col gap-1 text-xl font-bold">
                🏞️ Add Trip Information
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
                <div>
                  <p className="text-sm mb-1 after:content-['*'] after:text-danger after:ml-0.5">
                    Persons on trip (UNCHANGEABLE)
                  </p>
                  <TagsInput
                    value={tempData.persons ? tempData.persons : []}
                    onChange={handleTagChange}
                    placeHolder="Press SPACE to add"
                    onKeyUp={(e) => {
                      if (e.key === "Enter") {
                        onClose();
                        submitData();
                        setTempData({} as Data);
                      }
                    }}
                    separators={[" "]}
                    classNames={{
                      input: "text-sm bg-transparent",
                      tag: "bg-success text-black text-sm pl-2",
                    }}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="success"
                  onPress={() => {
                    onClose();
                    submitData();
                    setTempData({} as Data);
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
