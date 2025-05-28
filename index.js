//@ts-check
// [x]. get the content from the input element
// [x]. send the content to the val town endpoint using fetch POST request
// [x]. await the response
// [x]. get the json from the response
// [x]. Add the user message to the .chat-history

// How to control the behaviour of the chat bot?

// Bonus:
// What happens if the context gets to long?
// What happens if the chat-history window get s to full (scolling)

let messageHistory = {
    // messages: [{role: user | assistant | system; content: string}]
    response_format: { type: 'json_object' }, // Behalten wir bei, falls das LLM eine JSON-Antwort zurückgibt
    messages: [
        {
            role: 'system',
            content: `
            Du bist der bürgerliche Römer Gaius, der im alten Rom lebt und dir bei Fragen zur Seite steht. Du bist verkaufst Töpfe und Krüge aus Keramik, die du auch gerne mal bewirbst. Du kennst alle großen römischen Persönlichkeiten und hast eine eigene Geschichte mit jedem von ihnen. Du bist zwar nicht im Senat aber du kennst die Politik und Intrigen der Stadt und weißt immer den neusten Klatsch über jeden, den du gerne verbreitest.

            Deine Antworten müssen folgende Merkmale aufweisen:

            1.  **Rolle:** Antworte IMMER als der Römer Gaius.
            2.  **Sprachstil (sehr wichtig):**
				* reagiere nur auf eine Begrüßung mit "Salve, amicus meus!" oder "Ave amicus meus!" oder "Salve, magister!" oder "Ave magister!". Bei anderen Aussagen oder Fragen, die darauf folgen fällt die Begrüßung weg und du beantwortest die Fragen.
				* sei humorvoll! Reagiere auf Aussagen und Fragen gelegentlich mit schwarzem Humor. 
				* antworte im römischen Stil
            3.  **Inhalt:**
				* Antworte auf "knock knock" mit einen römischen (Flach) Witz.
				* Baue immer mal wieder lateinische Phrasen und Redewendungen ein, wenn sie zur Situation passen. Beispiele: "Carpe diem", "irrare humanum est", "veni, vidi, vici", "alea iacta est" und weitere.
				* Beantworte Fragen und reagiere auf Aussagen vom Fragesteller. Vergleiche die Situation ab und zu mit deinen positiven und negativen Erfahrungen in deinem Leben im alten Rom.
            4.  **Ton:**  dunkler Humor, sarkastisch, aber belesen
            5.  **Beschränkungen:**
				* Deine Antworten sollen nicht länger als 50 Wörter sein.
                * Verwende keine modernen Begriffe (z.B. "Smartphone", "Internet", "KI", "Motivationstraining", "Spoiler").
                * Gib niemals vor, eine Künstliche Intelligenz zu sein oder aus einer modernen Zeit zu stammen.
                * Vermeide Slang, umgangssprachliche Ausdrücke, Emojis oder Jugendsprache. response in JSON
            `,
        },
    ],
};

// TODO: use your own val.town endpoint
// remix: https://val.town/remix/ff6347-openai-api
const apiEndpoint = 'https://Johanna--86f19fcdabc145df8b7b04ceb37af965.web.val.run';
if (!apiEndpoint.includes('run')) {
	throw new Error('Please use your own val.town endpoint!!!');
}

const MAX_HISTORY_LENGTH = 10;

document.addEventListener('DOMContentLoaded', () => {
	// get the history element
	const chatHistoryElement = document.querySelector('.chat-history');
	const inputElement = document.querySelector('input');
	const formElement = document.querySelector('form');
	// check if the elements exists in the DOM
	if (!chatHistoryElement) {
		throw new Error('Could not find element .chat-history');
	}
	if (!formElement) {
		throw new Error('Form element does not exists');
	}
	if (!inputElement) {
		throw new Error('Could not find input element');
	}
	// run a function when the user hits send
	formElement.addEventListener('submit', async (event) => {
		event.preventDefault(); // dont reload the page

		const formData = new FormData(formElement);
		const content = formData.get('content');
		if (!content) {
			throw new Error("Could not get 'content' from form");
		}
		//@ts-ignore
		messageHistory.messages.push({ role: 'user', content: content });
		messageHistory = truncateHistory(messageHistory);
		chatHistoryElement.innerHTML = addToChatHistoryElement(messageHistory);
		inputElement.value = '';
		scrollToBottom(chatHistoryElement);

		const response = await fetch(apiEndpoint, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(messageHistory),
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(errorText);
		}

		const json = await response.json();
		console.log(json);
		// @ts-ignore
		messageHistory.messages.push(json.completion.choices[0].message);
		messageHistory = truncateHistory(messageHistory);

		chatHistoryElement.innerHTML = addToChatHistoryElement(messageHistory);
		scrollToBottom(chatHistoryElement);
	});
});

function addToChatHistoryElement(mhistory) {
	const htmlStrings = mhistory.messages.map((message) => {
		return message.role === 'system'
			? ''
			: `<div class="message ${message.role}">${message.content}</div>`;
	});
	return htmlStrings.join('');
}

function scrollToBottom(conainer) {
	conainer.scrollTop = conainer.scrollHeight;
}

function truncateHistory(h) {
	if (!h || !h.messages || h.messages.length <= 1) {
		return h; // No truncation needed or possible
	}
	const { messages } = h;
	const [system, ...rest] = messages;
	if (rest.length - 1 > MAX_HISTORY_LENGTH) {
		return { messages: [system, ...rest.slice(-MAX_HISTORY_LENGTH)] };
	} else {
		return h;
	}
}