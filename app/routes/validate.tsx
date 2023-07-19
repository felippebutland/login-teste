import { redirect, type ActionArgs, type V2_MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { sendEmail } from "~/models/email.server";
import { getToken, getUserByEmail } from "~/models/user.server";
import { createUserSession } from "~/session.server";
import { generateCode } from "~/utils";

export const action = async ({ request }: ActionArgs) => {
    const formData = await request.formData();
    const values = `${formData.get('firstValue')}${formData.get('secondValue')}${formData.get('thirdValue')}${formData.get('fourthValue')}${formData.get('fifthValue')}`

    const cookie = request.headers.get('Cookie').split('=')[1];
    
    const {
      email
    } = transformObject(cookie);

    const validateToken = await getToken(email, values);

    if(validateToken === null) {
        const token = generateCode(5)
        sendEmail('Seu código de validação', email, token )
    }

    const user = await getUserByEmail(email);

    if(!user) {
        return redirect('/join')
    }
    
    return createUserSession({
        redirectTo: '/notes',
        remember: true,
        request,
        userId: user.id,
    });
}

export function transformObject(value: string) {
  let inputString = value.replace(/\s/g, '');

  let pairs = inputString.split(';');
  let parsedObject = {};

  for (let i = 0; i < pairs.length; i++) {
    let pair = pairs[i].split(':');
    let key = pair[0];
    let value = pair[1];

    parsedObject[key] = value;
  }

  return parsedObject;
} 

export const meta: V2_MetaFunction = () => [{ title: 'Valide sua conta! 🫡' }];

export default function Validate() {
  const handleInputChange = (event) => {
    event.target.value = event.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Form method="post" className="max-w-md">
        <div className="mb-4">
          <label htmlFor="firstValue" className="block text-sm font-medium text-gray-700">
            Confirme o código recebido por e-mail
          </label>
          <div className="mt-1 flex">
            <input
              id="firstValue"
              name="firstValue"
              type="text"
              maxLength={1}
              onInput={handleInputChange}
              className="w-1/5 sm:w-1/4 md:w-1/3 lg:w-1/4 rounded border border-gray-500 border-2 px-1 py-0.5 text-lg mr-1"
            />
            <input
              id="secondValue"
              name="secondValue"
              type="text"
              maxLength={1}
              onInput={handleInputChange}
              className="w-1/5 sm:w-1/4 md:w-1/3 lg:w-1/4 rounded border border-gray-500 border-2 px-1 py-0.5 text-lg mr-1"
            />
            <input
              id="thirdValue"
              name="thirdValue"
              type="text"
              maxLength={1}
              onInput={handleInputChange}
              className="w-1/5 sm:w-1/4 md:w-1/3 lg:w-1/4 rounded border border-gray-500 border-2 px-1 py-0.5 text-lg mr-1"
            />
            <input
              id="fourthValue"
              name="fourthValue"
              type="text"
              maxLength={1}
              onInput={handleInputChange}
              className="w-1/5 sm:w-1/4 md:w-1/3 lg:w-1/4 rounded border border-gray-500 border-2 px-1 py-0.5 text-lg mr-1"
            />
            <input
              id="fifthValue"
              name="fifthValue"
              type="text"
              maxLength={1}
              onInput={handleInputChange}
              className="w-1/5 sm:w-1/4 md:w-1/3 lg:w-1/4 rounded border border-gray-500 border-2 px-1 py-0.5 text-lg"
            />
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-4 py-2 text-lg text-white bg-indigo-500 rounded hover:bg-indigo-600"
          >
            Confirmar
          </button>
        </div>
      </Form>
    </div>
  );
}
