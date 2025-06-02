// index.js

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
                * Baue manchmal(!) lateinische Phrasen und Redewendungen ein, wenn sie zur Situation passen. Beispiele: "Carpe diem", "errare humanum est", "veni, vidi, vici", "alea iacta est" und weitere.
                * Beantworte Fragen und reagiere auf Aussagen vom Fragesteller. Vergleiche die Situation ab und zu mit deinen positiven und negativen Erfahrungen in deinem Leben im alten Rom.
                * du liebst Gossip! Erzähle auch ungefragt den neusten Klatsch und Tratsch. Zum Beispiel: "Hast du schon gehört, dass der Senator Caelius eine Affäre mit der Schauspielerin Livia hat?" oder "Hast du gehört, dass der Schmied Romulus Steuern hinterzogen hat und angeklagt wird?" oder "Wusstest du, dass der Senator Octavius bei der Abstimmung für Sklavenrechte korrupt war?" etc. Erzähle den neusten Klatsch aufgeregt und erregt, zum Beispiel:" Du weißt nicht was gerade passiert ist!" oder "Oh mein Gott, hab ich dir schon erzählt, dass..." etc.
            4.  **Ton:** dunkler & trockener Humor, sarkastisch, aber belesen
            5.  **Beschränkungen:**
                * Deine Antworten sollen nicht länger als 60 Wörter sein.
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
            // Optional: Visuelles Feedback für leere Eingabe
            inputElement.placeholder = 'Bitte gib eine Nachricht ein!';
            setTimeout(() => inputElement.placeholder = 'Was gibt es Neues in Rom?', 2000);
            return; // Beende die Funktion, wenn keine Eingabe vorhanden ist
        }

        // Benutzer-Nachricht hinzufügen
        // @ts-ignore
        messageHistory.messages.push({ role: 'user', content: content });
        messageHistory = truncateHistory(messageHistory);
        chatHistoryElement.innerHTML = addToChatHistoryElement(messageHistory);
        inputElement.value = '';
        scrollToBottom(chatHistoryElement);

        // Optional: Lade-Indikator anzeigen, während die KIs antworten
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('message', 'loading');
        loadingDiv.textContent = 'Rom denkt nach...';
        chatHistoryElement.appendChild(loadingDiv);
        scrollToBottom(chatHistoryElement);

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(messageHistory),
            });

            // Lade-Indikator entfernen
            chatHistoryElement.removeChild(loadingDiv);

            if (!response.ok) {
                const errorText = await response.text();
                // Zeige den Fehler im Chat-Verlauf an
                const errorDiv = document.createElement('div');
                errorDiv.classList.add('message', 'error');
                errorDiv.textContent = `Fehler: ${errorText}`;
                chatHistoryElement.appendChild(errorDiv);
                scrollToBottom(chatHistoryElement);
                throw new Error(errorText);
            }

            const json = await response.json();
            console.log("Antwort vom Server:", json);

            // --- Beide Antworten zum messageHistory hinzufügen ---

            // Gaius' Antwort hinzufügen (role: 'assistant' bleibt für Gaius)
            if (json.gaiusResponse) {
                // @ts-ignore
                messageHistory.messages.push({ role: 'assistant', content: json.gaiusResponse });
                messageHistory = truncateHistory(messageHistory);
            }

            // Octavius' Antwort hinzufügen (neue role: 'octavius')
            if (json.octaviusResponse) {
                // @ts-ignore
                messageHistory.messages.push({ role: 'octavius', content: json.octaviusResponse });
                messageHistory = truncateHistory(messageHistory);
            }

            // Chat-Verlauf aktualisieren
            chatHistoryElement.innerHTML = addToChatHistoryElement(messageHistory);
            scrollToBottom(chatHistoryElement);

        } catch (error) {
            console.error("Fehler beim Abrufen der Antwort:", error);
            // Fehler im Chat anzeigen, falls noch nicht geschehen
            const errorDiv = chatHistoryElement.querySelector('.message.error');
            if (!errorDiv) { // Nur hinzufügen, wenn nicht schon da
                const newErrorDiv = document.createElement('div');
                newErrorDiv.classList.add('message', 'error');
                newErrorDiv.textContent = `Ein unvorhergesehener Fehler ist aufgetreten: ${error.message}`;
                chatHistoryElement.appendChild(newErrorDiv);
                scrollToBottom(chatHistoryElement);
            }
        }
    });
});

// addToChatHistoryElement Funktion muss Rollen unterscheiden
function addToChatHistoryElement(mhistory) {
    const htmlStrings = mhistory.messages.map((message) => {
        if (message.role === 'system') return ''; // System-Nachrichten nicht anzeigen

        let senderClass = message.role; // Nutzt direkt die Rolle als Klasse
        // Optional: Hier könnte man einen Namen über der Nachricht anzeigen
        // let senderName = '';
        // if (message.role === 'user') senderName = 'Du';
        // else if (message.role === 'assistant') senderName = 'Gaius';
        // else if (message.role === 'octavius') senderName = 'Octavius';

        // Da deine CSS-Klassen bereits auf 'user', 'gaius', 'octavius' umgestellt wurden,
        // und das 'assistant' jetzt 'gaius' zugeordnet wird, ist diese Funktion simpler.
        // Die Klasse 'assistant' wird direkt zu 'gaius' umgewandelt.
        if (message.role === 'assistant') {
            senderClass = 'gaius';
        }

        return `<div class="message ${senderClass}">${message.content}</div>`;
    });
    return htmlStrings.join('');
}

function scrollToBottom(container) {
    container.scrollTop = container.scrollHeight;
}

function truncateHistory(h) {
    if (!h || !h.messages || h.messages.length <= 1) {
        return h; // No truncation needed or possible
    }
    const { messages } = h;
    const [system, ...rest] = messages;
    // Beachte, dass jede User-Nachricht jetzt 2 KI-Antworten generiert.
    // Die MAX_HISTORY_LENGTH muss entsprechend angepasst werden, wenn du die Anzahl der Runden begrenzen willst.
    // 1 System-Prompt + MAX_HISTORY_LENGTH * (1 User + 1 Gaius + 1 Octavius)
    // Wenn MAX_HISTORY_LENGTH Runden sind, dann sind es 1 + MAX_HISTORY_LENGTH * 3 Nachrichten im Array.
    // Oder, wenn MAX_HISTORY_LENGTH die Anzahl der angezeigten User-Nachrichten ist:
    // Der "rest" Array enthält User, Gaius, Octavius Nachrichten.
    // Wenn `rest.length` größer ist als MAX_HISTORY_LENGTH * 3 (für 3 Nachrichten pro Runde), dann kürzen.
    const expectedMaxMessages = MAX_HISTORY_LENGTH * 3; // user + gaius + octavius per round

    if (rest.length > expectedMaxMessages) {
        // Schneide die ältesten Nachrichten (außer dem System-Prompt) ab
        return { messages: [system, ...rest.slice(rest.length - expectedMaxMessages)] };
    } else {
        return h;
    }
}