import Agent from "@/components/Agent";

const Page = async () => {

  return (
    <>
      <h3>Interview generation</h3>

      <Agent
        userName={"Pushpender Singh"}
        userId={"user_id_12345"}
        type="generate"
      />
    </>
  );
};

export default Page;
