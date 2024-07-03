'use client';

import { useState } from 'react';
import { getAnswer, streamAnswer } from './actions';
import { readStreamableValue } from 'ai/rsc';


// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [generation, setGeneration] = useState<string>('');

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">

      <div>
        <label className="relative block">
          <span className="sr-only">Search</span>
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            <svg className="h-5 w-5 fill-slate-300" viewBox="0 0 20 20"></svg>
          </span>
          <input id="promptId" className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300
                            rounded-md py-2 pl-9 pr-3
                            shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
            placeholder="Write.." type="text" name="search" value={input}
            onChange={event => {
              setInput(event.target.value);
            }}
          />
        </label>

        <br/>

        <button className="px-4 py-2 mr-4 rounded bg-blue-500 text-white font-bold"
          onClick={async () => {
            const { text, finishReason, usage } = await getAnswer(input);
            setGeneration(text);
          }}
        >Answer</button>

        <button className="px-4 py-2 rounded bg-blue-500 text-white font-bold"
          onClick={async () => {
            const { output } = await streamAnswer(input);
            setGeneration('')
            for await (const delta of readStreamableValue(output)) {
              setGeneration(currentGeneration => `${currentGeneration}${delta}`);
            }
          }}
        >Ask</button>

        <br/>

        <div className='mt-4'>{generation}</div>

        <br/>

      </div>

    </div>
    </main>
  );
}