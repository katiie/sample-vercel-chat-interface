'use server';

import { streamText, generateText } from 'ai';
import { openai} from '@ai-sdk/openai';
import { google } from "@ai-sdk/google"
import { createStreamableValue } from 'ai/rsc';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function continueConversation(history: Message[]) {
  'use server';

  const stream = createStreamableValue();

  (async () => {

    /* const { text } = await generateText({
      model: google('models/gemini-pro'),
      prompt: 'Write a vegetarian lasagna recipe for 4 people.',
    });

    const { textStream } = await streamText({
      model: google("models/gemini-1.5-pro-latest"),
      system:
        "You are a dude that doesn't drop character until the DVD commentary.",
      messages: history,
    });

    for await (const text of textStream) {
      stream.update(text);
    }

    stream.done(); */
  })();

  return {
    messages: history,
    newMessage: stream.value,
  };
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