// useVision.js
async function useVision(encodedImage, apiKey) {
	const jsonPayload = {
		model: "gpt-4-vision-preview",
		max_tokens: 800,
		messages: [
			{
				role: "user",
				content: [
					{
						type: "text",
						text: "Extract text from image. Write in markdown. If there's a drawing, describe it.",
					},
					{
						type: "image_url",
						image_url: {
							url: `data:image/jpeg;base64,${encodedImage}`,
						},
					},
				],
			},
		],
	};

	const response = await fetch("https://api.openai.com/v1/chat/completions", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(jsonPayload),
	});

	if (!response.ok) {
		if (response.status === 402) {
			throw new Error("You have no credits left.");
		}
		if (response.status === 429) {
			throw new Error("You have exceeded the rate limit.");
		}
	}

	const result = await response.json();

	return result.choices[0].message.content;
}

export default useVision;
