document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currentTab = tabs[0];
        var url = currentTab.url;
        document.getElementById('message').textContent = url;

        document.getElementById('queryButton').addEventListener('click', function() {
            var apiKey = 'app-UsBrNEXvPJQVc1wCLE0js2z3'; // Dify API key
            var apiUrl = 'https://api.dify.ai/v1/workflows/run';
            var user = 'abc-123';

            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: { url: url },
                    response_mode: 'streaming',
                    user: user
                })
            })
            .then(response => response.text())
            .then(text => {
                const lines = text.split('\n');
                let output = '';
                lines.forEach(line => {
                    if (line.trim()) {
                        try {
                            // 去除 'data: ' 前綴
                            const jsonString = line.replace(/^data:\s*/, '').trim();
                            if (jsonString.startsWith('{') && jsonString.endsWith('}')) { // 確保是有效的 JSON
                                const json = JSON.parse(jsonString);
                                if (json.data && json.data.outputs) {
                                    output += JSON.stringify(json.data.outputs, null, 2) + '\n';
                                }
                            }
                        } catch (e) {
                            console.error('Error parsing JSON:', e);
                        }
                    }
                });
                document.getElementById('response').textContent = output;
            })
            .catch(error => {
                document.getElementById('response').textContent = 'Error: ' + error;
            });
        });
    });
});