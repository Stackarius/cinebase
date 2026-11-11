import { Lock, Mail, UserRound } from "lucide-react";
import theater from "../../assets/theater.jpg"
import { Link } from "react-router-dom";
import { useRegisterForm } from "../../hooks/form";

const RegisterPage = () => {
  const { register, handleSubmit, errors, isSubmitting, submitError } = useRegisterForm();

  return (
    <div className="flex min-h-dvh justify-center items-center bg-gray-800 px-40 ">
      {/* container */}
      <div className="w-full h-120 flex justify-between items-start rounded-lg overflow-clip">
        {/* left side */}
        <div
          className="relative h-full p-8 w-1/2 flex flex-col justify-between bg-cover bg-center"
          style={{ backgroundImage: `url(${theater})` }}
        >
          <div className="absolute inset-0 bg-black/30" />

          {/* brand */}
          <a href="#" className="relative z-10 block w-fit pl-1 text-white text-2xl font-black border-2 border-cyan-700">
            Cine<span className="bg-cyan-400 text-gray-800 ml-1 px-2 w-full">Base</span>
          </a>

          {/*  */}
          <div className="z-10">
            <h2 className="text-white text-4xl font-semibold">Your Movie Life <br /><span className="bg-cyan-400 font-black bg-clip-text text-transparent">Beautifully</span> Framed</h2>
            <div className="flex gap-2 my-3">
              <span className="block h-1 w-14 bg-cyan-400/70 rounded"></span>
              <span className="block h-1 w-14 bg-cyan-400/80 rounded"></span>
              <span className="block h-1 w-14 bg-cyan-400 rounded"></span>
            </div>
          </div>
        </div>
        {/* right side */}
        <div className="p-20 bg-white h-full w-[50%]">
          <h2 className="text-3xl font-bold mb-5">Signup <span className="inline-block h-2 w-2 bg-cyan-700/70 rounded"></span>

          </h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className="p-2 mb-2 border-b border-gray-400 flex gap-3 items-end">
              <UserRound />
              <input
                type="text"
                autoComplete="name"
                aria-label="Name"
                aria-invalid={Boolean(errors.name)}
                className="w-full border-none outline-none mt-1"
                placeholder="Your name"
                {...register("name")}
              />
            </div>
            {errors.name && <p className="text-sm text-red-700" role="alert">{errors.name.message}</p>}
            <div className="p-2 mb-2 border-b border-gray-400 flex gap-3 items-end">
              <Mail />
              <input
                type="email"
                autoComplete="email"
                aria-label="Email"
                aria-invalid={Boolean(errors.email)}
                className="w-full border-none outline-none mt-1"
                placeholder="john.doe@cine"
                {...register("email")}
              />
            </div>
            {errors.email && <p className="text-sm text-red-700" role="alert">{errors.email.message}</p>}
            <div className="p-2 border-b border-gray-400 flex gap-3 items-end">
              <Lock />
              <input
                type="password"
                autoComplete="new-password"
                aria-label="Password"
                aria-invalid={Boolean(errors.password)}
                className="w-full border-none outline-none mt-1"
                placeholder="******"
                {...register("password")}
              />
            </div>
            {errors.password && <p className="text-sm text-red-700" role="alert">{errors.password.message}</p>}

            {submitError && <p className="mt-3 text-sm text-red-700" role="alert">{submitError}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="my-5 text-white font-semibold cursor-pointer bg-cyan-800 hover:bg-cyan-900 disabled:cursor-not-allowed disabled:opacity-60 px-4 py-2 w-full"
            >
              {isSubmitting ? "Creating account..." : "Submit"}
            </button>
          </form>

          {/* dont have an account */}
          <p>Already have an account? <Link to="/login" className="text-cyan-700 font-semibold "> Login</Link></p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage