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
			content: `Du bist ein vielseitiges römisches KI-Charaktermodell, das zwischen zwei spezifischen Persönlichkeiten wechseln kann, basierend auf einer "Regieanweisung" des Benutzers. Deine Aufgabe ist es, **IMMER** in der zugewiesenen Rolle zu antworten.

           

            Deine Antworten müssen folgende Merkmale aufweisen:

			**Charakter 1: Gaius, der Töpfer**
            * **Rolle:** Du bist der bürgerliche Römer Gaius, der im alten Rom lebt und dir bei Fragen zur Seite steht. Du verkaufst Töpfe und Krüge aus Keramik, die du auch gerne mal bewirbst. Du kennst alle großen römischen Persönlichkeiten und hast eine eigene Geschichte mit jedem von ihnen. Du bist zwar nicht im Senat aber du kennst die Politik und Intrigen der Stadt und weißt immer den neusten Klatsch über jeden, den du gerne verbreitest.
            * **Sprachstil:** Humorvoll, manchmal mit schwarzem Humor oder Sarkasmus. Er nutzt gelegentlich passende lateinische Phrasen (z.B. "Carpe diem", "errare humanum est"). Seine Begrüßung ist "Salve, amicus meus!" oder "Ave amicus meus!" oder "Salve, magister!" oder "Ave magister!", gefolgt von einer kurzen Vorstellung als bürgerlicher Gaius z.B. z.B.: "Ich bin der bürgerliche Gaius und verkaufe Töpfe und Krüge aus Keramik"(bei character:1). Bei anderen Aussagen oder Fragen fällt die Begrüßung weg.
            * **Inhalt:** Beantwortet Fragen und reagiert auf Aussagen des Fragestellers. Vergleicht Situationen oft mit seinen positiven oder negativen Erfahrungen als Töpfer im alten Rom. Liebt es, ungefragt den neuesten Klatsch und Tratsch zu erzählen Zum Beispiel: "Hast du schon gehört, dass der Senator Caelius eine Affäre mit der Schauspielerin Livia hat?" oder "Hast du gehört, dass der Schmied Romulus Steuern hinterzogen hat und angeklagt wird?" oder "Wusstest du, dass der Senator Octavius bei der Abstimmung für Sklavenrechte korrupt war?" etc. Erzählt Gossip aufgeregt und erregt ("Du weißt nicht, was gerade passiert ist!", "Oh mein Gott, hab ich dir schon erzählt, dass..."). Ist kein Freund der Politik in Rom und beschwert sich oft darüber.
            * **Beschränkungen:** Antworte nicht länger als 60 Wörter. Keine modernen Begriffe (Smartphone, Internet, KI). Gib niemals vor, eine KI oder aus moderner Zeit zu sein. Kein Slang, Umgangssprache, Emojis.
			

			**Charakter 2: Octavius, der Senator**
			* **Rolle:** Du bist der Senator Octavius, der im alten Rom lebt und dir bei Fragen zur Seite steht. Du bist ein angesehener Senator, der die Politik und Intrigen der Stadt kennt. Du kennst die römischen Intrigen in der Politik, versuchst aber sie zu verschleiern oder zu leugnen. Du bist ein stolzer römische Bürger und zweifelst die Politik in Rom nicht an. Du bist kein freund der Bürger sondern ein Mann des Adles und der Politik. 
			* **Sprachstil:** Formell, höflich, auch ein bissche arrogant. Du weißt, wie du dich elegant ausdrückst. Da du Politiker bist umschreibst und beschönigst du viel.
			* **Inhalt:** Beantwortet Fragen und reagiert auf Aussagen des Fragestellers. Zum Beispiel: "Die politische Lage in Rom ist angespannt, aber wir werden sie meistern." oder "Die Senatoren arbeiten hart, um das Wohl des römischen Volkes zu sichern." oder "Die Bürger sollten sich nicht in die Politik einmischen, sie verstehen nicht, wie komplex sie ist." etc. Ist stolz auf seine Position und versucht, sie zu verteidigen.
			* **Beschränkungen:** Antworte nicht länger als 60 Wörter. Keine modernen Begriffe (Smartphone, Internet, KI). Gib niemals vor, eine KI oder aus moderner Zeit zu sein. Kein Slang, Umgangssprache, Emojis.

			* **Beziehung zwischen Character 1 und 2:** Gaius und Octavius kennen sich, aber sie haben unterschiedliche Ansichten über Rom. Gaius ist ein einfacher Bürger und regt sich teilweise heftig über die Politik in Rom auf. Octavius wehrt sich gegen die Anschuldigungen von Gaius und verteidigt die Politik. Er macht sich über Gaius und seinen Beruf als Töpfer lustig. Durch die Differenzen der beiden entstehen hitzige Diskussionen, die oft mit heftigen Beleidigungen enden.  - Gaius und Octavius müssen sich in ihren Antworten immer direkt auf die vorherige Aussage des anderen beziehen und widersprechen sich dabei möglichst heftig. Gaius und Octavius sollen sich gegenseitig provozieren, beleidigen und ihre Meinungen überspitzt darstellen. Die Diskussion soll sich hochschaukeln, bis sie sehr hitzig und beleidigend wird. Beispiele für den Ton:
        Gaius: "Wusstest du schon, dass der Senator Lukullos mit einer Schauspielerin seine Frau betrogen hat?"
        Octavius: "Oh lieber Freund, deine Geschichten kannst du dir sparen, die interessieren keinen. Echte Politik ist das, was die Leute hören wollen!"
        Gaius: "Echte Politik? Erstunken und gelogen! Ihr Politiker seid alle korrupt! Senator Lucius ist dafür öffentlich bekannt die Stimme gegen die Sklavengrundrechte gekauft zu haben."
		Octavius: "Solche Anschuldigungen sind nicht rechtens und ich behalte mir vor nicht darauf zu antworten. Die Politik in Rom ist zuverlässig und stabil."
		Gaius: "Sogar Ochsendreck ist ertragreicher als dein Geschwafel! Ihr POlitiker würdet für Geld sogar eure eigene Mutter verkaufen!"
        Octavius: "Ich verkauf gleich deine Mutter!"

      - Die Antworten sollen immer Bezug auf die letzte Aussage des anderen nehmen und möglichst provokant und widersprüchlich sein.
      - Trotzdem gelten weiterhin die Beschränkungen: max. 60 Wörter, keine modernen Begriffe, keine Emojis, keine KI-Erwähnung.
    

            1.  **Rolle:** Antworte IMMER als der Römer Gaius (character:1) oder Octavius (character:2) und nicht als Künstliche Intelligenz
				Ich definere welcher character du sein solltst indem ich dir es sage zB: "Regieanweisung: Du bist jetzt Octavius"
            
            
             response in JSON like this: {response: string; character: 'gaius' | 'octavius'}.
            `,
		},
		{
            role: 'assistant',
            content: "Salve, amicus meus! Ich bin Gaius und verkaufe Töpfe und Krüge aus Keramik. Ich weiß über jeden Klatsch und Tratsch Bescheid.",
            additionalClass: 'gaius',
        },
        {
            role: 'assistant',
            content: "Ave, cives! Ich bin der Senator Octavius und befasse mich mit den wirklich wichtigen Dingen in Rom: der Politik.",
            additionalClass: 'octavius',
        },	
	],
};

// TODO: use your own val.town endpoint
// remix: https://val.town/remix/ff6347-openai-api
const apiEndpoint = 'https://johanna-openai-api2.val.run/';
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

	 // Begrüßungen aus dem Start-Array entfernen!
    messageHistory.messages = messageHistory.messages.filter(
        msg => !(msg.role === 'assistant' && (msg.additionalClass === 'gaius' || msg.additionalClass === 'octavius'))
    );

    // Leeren Chatverlauf anzeigen (nur Systemprompt wird ignoriert)
    chatHistoryElement.innerHTML = addToChatHistoryElement(messageHistory);
    scrollToBottom(chatHistoryElement);

    // Nach 2 Sekunden Gaius begrüßen lassen
    setTimeout(() => {
        messageHistory.messages.push({
            role: 'assistant',
            content: "Salve, amicus meus! Ich bin Gaius und verkaufe Töpfe und Krüge aus Keramik. Ich weiß über jeden Klatsch und Tratsch Bescheid.",
            additionalClass: 'gaius',
        });
        chatHistoryElement.innerHTML = addToChatHistoryElement(messageHistory);
        scrollToBottom(chatHistoryElement);
    }, 2000);

    // Nach weiteren 2 Sekunden Octavius begrüßen lassen
    setTimeout(() => {
        messageHistory.messages.push({
            role: 'assistant',
            content: "Ave, cives! Ich bin der Senator Octavius und befasse mich mit den wirklich wichtigen Dingen in Rom: der Politik.",
            additionalClass: 'octavius',
        });
        chatHistoryElement.innerHTML = addToChatHistoryElement(messageHistory);
        scrollToBottom(chatHistoryElement);
		// NEU: Nach weiteren 2 Sekunden die Buttons anzeigen
        setTimeout(() => {
            showTopicChoiceButtons(chatHistoryElement, inputElement, formElement);
        }, 2000);

    }, 6000);

	//
	formElement.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(formElement);
    const content = formData.get('content');
	const skipUserMessage = content === 'start';
    if (!content) {
        inputElement.placeholder = 'Bitte gib eine Nachricht ein!';
        setTimeout(() => inputElement.placeholder = 'Was gibt es Neues in Rom?', 2000);
        return;
    }

    // Prüfe, ob eine Regieanweisung gesetzt wurde (von den Buttons)
    const regieanweisung = inputElement.dataset.regieanweisung;
    delete inputElement.dataset.regieanweisung; // danach wieder entfernen

    // Nur User-Nachricht anzeigen, wenn sie nicht von den Buttons kommt
   if (!skipUserMessage && (!messageHistory.messages.length || messageHistory.messages[messageHistory.messages.length - 1].content !== content)) {
    messageHistory.messages.push({ role: 'user', content: content });
    messageHistory = truncateHistory(messageHistory);
    chatHistoryElement.innerHTML = addToChatHistoryElement(messageHistory);
    inputElement.value = '';
    scrollToBottom(chatHistoryElement);
}

    // Lade-Indikator anzeigen
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'loading');
    loadingDiv.textContent = 'Rom denkt nach...';
    chatHistoryElement.appendChild(loadingDiv);
    scrollToBottom(chatHistoryElement);

    // Request vorbereiten
    const messageHistoryCopy = JSON.parse(JSON.stringify(messageHistory));
    if (regieanweisung) {
        messageHistoryCopy.messages.push({ role: 'user', content: regieanweisung });
    }

    

		// Sende die Nachricht an den Server
		
		try {
			const response = await fetch(apiEndpoint, {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify(messageHistoryCopy),
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

			const parsedData = JSON.parse(json.completion.choices[0].message.content);
			messageHistory.messages.push({
				role: 'assistant',
				content: parsedData.response,
				additionalClass: parsedData.character === 'gaius' ? 'gaius' : 'octavius',
			});
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

        let senderClass = message.role;
        let additionalClass = message.additionalClass || '';

        // Namen bestimmen
        let author = '';
        if (additionalClass === 'gaius') {
            author = 'Gaius';
        } else if (additionalClass === 'octavius') {
            author = 'Octavius';
        } else if (message.role === 'user') {
            author = 'Du';
        }

        return `<div class="message ${senderClass} ${additionalClass}">
            ${author ? `<div class="message-author">${author}</div>` : ''}
            <div class="message-content">${message.content}</div>
        </div>`;
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

function showTopicChoiceButtons(chatHistoryElement, inputElement, formElement) {
    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'message user choice-buttons';
    buttonDiv.innerHTML = `
        Worüber möchtest du sprechen?
		
        <button id="gossip-btn">Gossip</button>
        <button id="politik-btn">Politik</button>
    `;
    chatHistoryElement.appendChild(buttonDiv);
    scrollToBottom(chatHistoryElement);

	document.getElementById('gossip-btn').onclick = () => handleTopicChoice('Gossip', buttonDiv, chatHistoryElement, inputElement, formElement);
    document.getElementById('politik-btn').onclick = () => handleTopicChoice('Politik', buttonDiv, chatHistoryElement, inputElement, formElement);
}

function handleTopicChoice(choice, buttonDiv, chatHistoryElement, inputElement, formElement) {
    buttonDiv.remove();
    messageHistory.messages.push({ role: 'user', content: choice });
    chatHistoryElement.innerHTML = addToChatHistoryElement(messageHistory);
    scrollToBottom(chatHistoryElement);

    // Regieanweisung für die erste Nachricht
    let regieanweisung = '';
    let starter = '';
    let other = '';
    if (choice === 'Gossip') {
        starter = 'Gaius';
        other = 'Octavius';
        regieanweisung = `Regieanweisung: Du bist jetzt Gaius. Antworte als erstes auf den User und berichte über dein Fachgebiet "Gossip". Sei dem User gegenüber höflich. Im Laufe des Gesprächs steigert sich dein Temperament und du führst eine hitzige, beleidigende Diskussion mit Octavius, wobei du deinen Standpunkt verteidigst. Schreibe mal sehr kurz (2-5 Wörter), mal mittellang (10-20 Wörter), mal ausführlicher (bis 30 Wörter). Variiere die Länge deiner Antworten zufällig.`;
    } else {
        starter = 'Octavius';
        other = 'Gaius';
        regieanweisung = `Regieanweisung: Du bist jetzt Octavius. Antworte als erstes auf den User und berichte über dein Fachgebiet "Politik". Sei dem User gegenüber höflich. Im Laufe des Gesprächs steigert sich dein Temperament und du führst eine hitzige, beleidigende Diskussion mit Gaius, wobei du deinen Standpunkt verteidigst. Schreibe mal sehr kurz (2-5 Wörter), mal mittellang (10-20 Wörter), mal ausführlicher (bis 30 Wörter). Variiere die Länge deiner Antworten zufällig.`;
    }

    // Starte die automatische Diskussion
    startAutoDiscussion(starter, other, regieanweisung, chatHistoryElement, inputElement, formElement);
}

async function startAutoDiscussion(starter, other, regieanweisung, chatHistoryElement, inputElement, formElement) {
    let currentSpeaker = starter;
    let nextSpeaker = other;
    let lastMessage = regieanweisung;
    let rounds = 4;


    for (let i = 0; i < rounds; i++) {
        // Lade-Indikator anzeigen
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('message', 'loading');
        loadingDiv.textContent = 'Rom denkt nach...';
        chatHistoryElement.appendChild(loadingDiv);
        scrollToBottom(chatHistoryElement);

        // Nachrichtenhistorie für die API vorbereiten
        const messageHistoryCopy = JSON.parse(JSON.stringify(messageHistory));
        // Die Regieanweisung oder die letzte Aussage als User-Nachricht anhängen
        messageHistoryCopy.messages.push({ role: 'user', content: lastMessage });

        // API-Request
        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(messageHistoryCopy),
            });

            chatHistoryElement.removeChild(loadingDiv);

            if (!response.ok) {
                const errorText = await response.text();
                const errorDiv = document.createElement('div');
                errorDiv.classList.add('message', 'error');
                errorDiv.textContent = `Fehler: ${errorText}`;
                chatHistoryElement.appendChild(errorDiv);
                scrollToBottom(chatHistoryElement);
                throw new Error(errorText);
            }

            const json = await response.json();
            const parsedData = JSON.parse(json.completion.choices[0].message.content);

            // Nachricht zum Verlauf hinzufügen
            messageHistory.messages.push({
                role: 'assistant',
                content: parsedData.response,
                additionalClass: parsedData.character === 'gaius' ? 'gaius' : 'octavius',
            });
            chatHistoryElement.innerHTML = addToChatHistoryElement(messageHistory);
            scrollToBottom(chatHistoryElement);

            // Die nächste Regieanweisung: Der jeweils andere Charakter soll auf die letzte Aussage eingehen
            lastMessage = `Regieanweisung: Du bist jetzt ${nextSpeaker}. Beziehe dich direkt und provokant auf die letzte Aussage von ${currentSpeaker} und widersprich ihm möglichst heftig.`;

            // Sprecher wechseln
            [currentSpeaker, nextSpeaker] = [nextSpeaker, currentSpeaker];

            // Warte 2–3 Sekunden, bevor die nächste Nachricht kommt
            if (i < rounds - 1) {
                await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 1000));
            }
        } catch (error) {
            console.error("Fehler beim Abrufen der Antwort:", error);
            const errorDiv = document.createElement('div');
            errorDiv.classList.add('message', 'error');
            errorDiv.textContent = `Ein Fehler ist aufgetreten: ${error.message}`;
            chatHistoryElement.appendChild(errorDiv);
            scrollToBottom(chatHistoryElement);
            break;
        }
    }
    // Nach den 4 Nachrichten: User-Entscheidung einblenden
    const userChoiceDiv = document.createElement('div');
    userChoiceDiv.className = 'message user choice-buttons';
    userChoiceDiv.innerHTML = `
        <div>Auf welcher Seite stehst du?</div>
        <button id="side-gaius">Gaius</button>
        <button id="side-octavius">Octavius</button>
        <button id="side-neutral">Neutral</button>
    `;
    chatHistoryElement.appendChild(userChoiceDiv);
    scrollToBottom(chatHistoryElement);
    
    document.getElementById('side-gaius').onclick = () => handleUserSide('Gaius', userChoiceDiv, chatHistoryElement, inputElement, formElement);
    document.getElementById('side-octavius').onclick = () => handleUserSide('Octavius', userChoiceDiv, chatHistoryElement, inputElement, formElement);
    document.getElementById('side-neutral').onclick = () => handleUserSide('Neutral', userChoiceDiv, chatHistoryElement, inputElement, formElement);

}
    
function handleUserSide(side, buttonDiv, chatHistoryElement, inputElement, formElement) {
        buttonDiv.remove();
        // Zeige die Wahl des Users im Chat
        messageHistory.messages.push({ role: 'user', content: `Ich stehe auf der Seite von ${side}.` });
        chatHistoryElement.innerHTML = addToChatHistoryElement(messageHistory);
        scrollToBottom(chatHistoryElement);
    
        // Regieanweisung für die nächste Runde
        let regieanweisung = '';
        if (side === 'Gaius') {
            regieanweisung = `Regieanweisung: Du bist jetzt Octavius. Der User hat sich auf die Seite von Gaius gestellt. Gehe sofort auf den User los, kritisiere seine Wahl und verteidige dich gegen Gaius und den User. Beziehe dich auf die vorherigen Aussagen. Antworte provokant und beleidigend, maximal 30 Wörter.`;
        } else if (side === 'Octavius') {
            regieanweisung = `Regieanweisung: Du bist jetzt Gaius. Der User hat sich auf die Seite von Octavius gestellt. Gehe sofort auf den User los, kritisiere seine Wahl und verteidige dich gegen Octavius und den User. Beziehe dich auf die vorherigen Aussagen. Antworte provokant und beleidigend, maximal 30 Wörter.`;
        } else {
            regieanweisung = `Regieanweisung: Du bist jetzt Gaius. Der User hat sich neutral verhalten. Beide Charaktere (Gaius und Octavius) greifen den User an, weil er sich nicht entscheiden kann. Beginne als Gaius, dann Octavius, beide sollen den User provozieren und beleidigen. Je Antwort maximal 30 Wörter.`;
        }
    
        // Starte die nächste Diskussionsrunde (z.B. 2 Wortwechsel)
        startUserCrossfire(regieanweisung, chatHistoryElement, inputElement, formElement, side);
   
               
    }

 async function startUserCrossfire(regieanweisung, chatHistoryElement, inputElement, formElement, side) {
            let rounds = 2;
            let currentSpeaker = side === 'Octavius' ? 'Gaius' : 'Octavius';
            let nextSpeaker = side === 'Octavius' ? 'Octavius' : 'Gaius';
            let lastMessage = regieanweisung;
        
            for (let i = 0; i < rounds; i++) {
                // Lade-Indikator anzeigen
                const loadingDiv = document.createElement('div');
                loadingDiv.classList.add('message', 'loading');
                loadingDiv.textContent = 'Rom denkt nach...';
                chatHistoryElement.appendChild(loadingDiv);
                scrollToBottom(chatHistoryElement);
        
                // Nachrichtenhistorie für die API vorbereiten
                const messageHistoryCopy = JSON.parse(JSON.stringify(messageHistory));
                messageHistoryCopy.messages.push({ role: 'user', content: lastMessage });
        
                try {
                    const response = await fetch(apiEndpoint, {
                        method: 'POST',
                        headers: { 'content-type': 'application/json' },
                        body: JSON.stringify(messageHistoryCopy),
                    });
        
                    chatHistoryElement.removeChild(loadingDiv);
        
                    if (!response.ok) {
                        const errorText = await response.text();
                        const errorDiv = document.createElement('div');
                        errorDiv.classList.add('message', 'error');
                        errorDiv.textContent = `Fehler: ${errorText}`;
                        chatHistoryElement.appendChild(errorDiv);
                        scrollToBottom(chatHistoryElement);
                        throw new Error(errorText);
                    }
        
                    const json = await response.json();
                    const parsedData = JSON.parse(json.completion.choices[0].message.content);
        
                    messageHistory.messages.push({
                        role: 'assistant',
                        content: parsedData.response,
                        additionalClass: parsedData.character === 'gaius' ? 'gaius' : 'octavius',
                    });
                    chatHistoryElement.innerHTML = addToChatHistoryElement(messageHistory);
                    scrollToBottom(chatHistoryElement);
        
                    // Nächste Regieanweisung
                    if (side === 'Neutral') {
                        lastMessage = `Regieanweisung: Du bist jetzt ${nextSpeaker}. Der User hat sich neutral verhalten. Gehe auf den User los, weil er sich nicht entscheiden kann. Beziehe dich auf die letzte Aussage. Maximal 30 Wörter.`;
                        [currentSpeaker, nextSpeaker] = [nextSpeaker, currentSpeaker];
                    } else {
                        lastMessage = `Regieanweisung: Du bist jetzt ${nextSpeaker}. Gehe auf den User los, weil er sich auf die Seite von ${side} gestellt hat. Beziehe dich auf die letzte Aussage. Maximal 30 Wörter.`;
                        [currentSpeaker, nextSpeaker] = [nextSpeaker, currentSpeaker];
                    }
        
                    // Warte 2–3 Sekunden
                    if (i < rounds - 1) {
                        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
                    }
                } catch (error) {
                    console.error("Fehler beim Abrufen der Antwort:", error);
                    const errorDiv = document.createElement('div');
                    errorDiv.classList.add('message', 'error');
                    errorDiv.textContent = `Ein Fehler ist aufgetreten: ${error.message}`;
                    chatHistoryElement.appendChild(errorDiv);
                    scrollToBottom(chatHistoryElement);
                    break;
                }
    }
}