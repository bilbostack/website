+++
title = 'La Espuela'
description = "La Espuela, BilboStack 2027's afternoon networking at San Mamés stadium: drinks, food, live music and prize draws, from 14:00 to 20:00. Included with your ticket."
type = 'networking'
seoTitle = "La Espuela at San Mamés · BilboStack 2027"
seoDescription = "La Espuela, BilboStack 2027's Saturday afternoon, is played at San Mamés: networking, drinks, food, live music and prize draws from 14:00 to 20:00. Included with your ticket."
image = 'img/networking/og-la-espuela.jpg'   # social share (og:image / X card): San Mamés + La Espuela, 1200×630
heading = "La Espuela is played at San Mamés"
lead = "Once the talks are over, we head to La Catedral: a space inside San Mamés stadium to keep the conversation going with drinks, food, live music and prize draws."
venueText = "San Mamés is much more than a stadium: it's one of Bilbao's icons. This year BilboStack's La Espuela moves to a space inside La Catedral, a short walk from the Palacio Euskalduna."
transport = "San Mamés metro (L1 · L2) · San Mamés tram stop"
# Access to the networking space inside the stadium. Empty = "Pending" on the page.
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
  { position = "left-top", icon = "drinks", notIncluded = true, title = "Drinks with and without alcohol", text = "Something to toast the day's talks and everything that's still to come." },
  { position = "left-bottom", icon = "food", note = "There'll be something", title = "Food", text = "Refuel after a full day so no conversation gets left halfway." },
  { position = "center", icon = "networking", captain = true, title = "Networking", text = "The heart of BilboStack. Old friends, new faces and connections that start with “so, what do you do?”." },
  { position = "right-top", icon = "music", title = "Live music", text = "A live soundtrack for the whole afternoon." },
  { position = "right-bottom", icon = "raffle", title = "Prize draws", text = "There will be prize draws during the afternoon, so don't leave before the final whistle." },
]
+++
