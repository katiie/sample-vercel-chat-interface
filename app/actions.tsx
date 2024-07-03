'use server';

import { streamText, generateText } from 'ai';
import { openai} from '@ai-sdk/openai';
import { google } from "@ai-sdk/google"
import { createStreamableValue } from 'ai/rsc';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}


export async function getAnswer(question: string) {
  const { text, finishReason, usage } = await generateText({
    model: google('models/gemini-pro'),
    prompt: question,
  });

  return { text, finishReason, usage };
}

export async function streamAnswer(question: string) {

  const stream = createStreamableValue('');

  (async () => {
    const { textStream } = await streamText({
      model: google('models/gemini-pro'),
      prompt: question,
  });
  for await (const delta of textStream) {
    stream.update(delta);
  }

    stream.done();
  })();

  return { output: stream.value };
}