+++
title = 'Networking'
description = 'BilboStack 2027 networking at San Mamés stadium: drinks, food, live music and prize draws, from 14:00 to 20:00.'
type = 'networking'
seoTitle = "Networking at San Mamés · BilboStack 2027"
seoDescription = "BilboStack 2027's Saturday afternoon is played at San Mamés: networking, drinks, food, live music and prize draws from 14:00 to 20:00."
image = 'img/bilbostack_publico.webp'   # social share (og:image)
heading = "The second half is played at San Mamés"
lead = "Once the talks are over, we head to La Catedral: a space inside San Mamés stadium to keep the conversation going with drinks, food, live music and prize draws."
venueText = "San Mamés is much more than a stadium: it's one of Bilbao's icons. This year BilboStack's networking moves to a space inside La Catedral, a short walk from the Palacio Euskalduna."
transport = "San Mamés metro (L1 · L2) · San Mamés tram stop"
# Access to the networking space inside the stadium. Empty = "Not defined yet" on the page.
access = { gate = "", space = "" }

# Afternoon schedule (right column of the hero). `time` = start of each slot; the last
# one runs until networking.end (hugo.toml). Same order in all three languages.
schedule = [
  { time = "14:00", title = "Arrival, food and networking", text = "Lunch and the first conversations, with a laid-back DJ in the background." },
  { time = "16:30", title = "Games and activities", text = "A Kahoot on the history of BilboStack (with a prize draw), contests and community activities, with live music in between." },
  { time = "18:30", title = "Music and drinks", text = "The afternoon rolls on with music until the final whistle." },
]

# Same order and positions as networking.es.md.
lineup = [
  { position = "left-top", icon = "drinks", title = "Drinks", text = "Something to toast the day's talks and everything that's still to come." },
  { position = "left-bottom", icon = "food", title = "Food", text = "Refuel after a full day so no conversation gets left halfway." },
  { position = "center", icon = "networking", captain = true, title = "Networking", text = "The heart of BilboStack: old friends, new faces and conversations that start with “so, what do you work on?” and end up as projects." },
  { position = "right-top", icon = "music", title = "Live music", text = "A live soundtrack for the whole afternoon." },
  { position = "right-bottom", icon = "raffle", title = "Prize draws", text = "There will be prize draws during the afternoon, so don't leave before the final whistle." },
]
+++
