import { auth } from "@/auth";
import PostalForm from "@/components/PostalForm";
import { redirect } from "next/navigation";


const Page = async () => {
  const session = await auth()

  if (!session) redirect('/')  

    return (
        <>
            <section className="black-container">
                <h1 className="heading">Publish your poems</h1>
                <p className="text-white">Let the world read your creative chaos.</p>
            </section>

            <PostalForm />
        </>
    )
}

export default Page;