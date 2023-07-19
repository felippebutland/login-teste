import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { sendEmail } from "~/models/email.server";

import { createUser, getUserByEmail } from "~/models/user.server";
import { getUserId } from "~/session.server";
import { generateCode, validateEmail } from "~/utils";

import image from "~/../public/image.png";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get('verify-password');
  const cellphone = formData.get('tel');
  const regexMatch = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-zA-Z]).{8}$/;

  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 }
    );
  }

  if(password !== confirmPassword ) {
    return json(
      {errors: { email: null, password: 'as senhas são diferentes!'} },
      { status: 400 }
    );
  }

  if (password.length < 8 || regexMatch.test(password) ) {
    return json(
      { errors: { email: null, password: "Password is invalid, please create a good password" } },
      { status: 400 }
    );
  }
  
  if(!cellphone) {
    return json(
      { errors: { email: null, password: null, cellphone: 'Cellphone Invalid' } },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json(
      {
        errors: {
          email: "A user already exists with this email",
          password: null,
        },
      },
      { status: 400 }
    );
  }

  const token = generateCode(5);
  await sendEmail('Seu token de acesso', email, token)
  
  await createUser(email, password, cellphone as string, false)
  
  return redirect('/validate', {
    headers: {
      "Set-Cookie": `email: ${email}`
    }
  })
};

export const meta: V2_MetaFunction = () => [{ title: "Sign Up" }];


const countryCodes = [
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+1', country: 'Canada', flag: '🇨🇦' },
  { code: '+52', country: 'Mexico', flag: '🇲🇽' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+56', country: 'Chile', flag: '🇨🇱' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴' },
  { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
  { code: '+591', country: 'Bolivia', flag: '🇧🇴' },
  { code: '+592', country: 'Guyana', flag: '🇬🇾' },
  { code: '+593', country: 'Ecuador', flag: '🇪🇨' },
  { code: '+594', country: 'French Guiana', flag: '🇬🇫' },
  { code: '+595', country: 'Paraguay', flag: '🇵🇾' },
  { code: '+596', country: 'Martinique', flag: '🇲🇶' },
  { code: '+597', country: 'Suriname', flag: '🇸🇷' },
  { code: '+598', country: 'Uruguay', flag: '🇺🇾' },
  { code: '+599', country: 'Netherlands Antilles', flag: '🇧🇶' },
];


export default function Join() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    const selected = countryCodes.find((country) => country.code === countryCode);
    setSelectedCountry(selected);
  };

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);
  
  return (
    <div className="flex min-h-full">
      <div className="flex-1 flex flex-col justify-center">
        <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <div className="mt-1">
              <input
                id="Nome"
                required
                autoFocus={true}
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
            </div>
          </div>
          
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              E-mail
            </label>
            <div className="mt-1">
              <input
                ref={emailRef}
                id="email"
                required
                autoFocus={true}
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.email ? (
                <div className="pt-1 text-red-700" id="email-error">
                  {actionData.errors.email}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex items-center">
          <div className="mr-2">
          <select
            value={selectedCountry.code}
            onChange={handleCountryChange}
            className="appearance-none bg-white border border-gray-300 px-2 py-1 rounded-md focus:outline-none"
          >
            {countryCodes.map((country, index) => (
              <option key={index} value={country.code}>
                {country.flag} {country.country}
              </option>
            ))}
          </select>
          </div>
          <div>
            <input
              type="tel"
              id='tel'
              name="tel"
              className="appearance-none bg-white border border-gray-500 px-2 py-1 rounded-md focus:outline-none"
              placeholder={`Ex: ${selectedCountry.code} XXX-XXX-XXXX`}
            />
          </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <div className="text-gray-400 text-xs">Sua senha deve ter pelo menos 8 caracteres, 1 caracter especial e 1 número</div>
            <div className="mt-1">
              <input
                id="password"
                ref={passwordRef}
                name="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.password ? (
                <div className="pt-1 text-red-700" id="password-error">
                  {actionData.errors.password}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label
              htmlFor="verify-password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirme sua senha
            </label>
            <div className="mt-1">
              <input
                id="verify-password"
                name="verify-password"
                type="password"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Create Account
          </button>
          
          <div className="flex items-center justify-center">
            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: "/login",
                  search: searchParams.toString(),
                }}
              >
                Log in
              </Link>
            </div>
          </div>
        </Form>
        </div>
      </div>
      <div className="flex-1 flex items-right justify-right h-screen">
        <img src={image} alt='a beatifull' className="w-full h-full object-cover"/>
      </div>
    </div>
  );
}
