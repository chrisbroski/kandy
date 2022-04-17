# Development Prioritization

## Features

Notifications

Tip Jar Page

Link to /api from front end somewhere not obvious to the casual browser, but findable to someone aware. Maybe a gear in the top left "Accessible version"

    .SkipNav {
        color: #FFFFFF; /* same color as background */
        text-decoration: none;
    }
    .SkipNav:active, .SkipNav:focus {
        /* Becomes visible & underlined when user tabs to it.
            :active pseudo-class necessary for IE
            :focus pseudo-class necessary for Mozilla
        */
        color: #0000FF;
        text-decoration: underline;
    }

EPK Page

## Bugs

Need to use "Good Vibes" not "Great Vibes"

Combine Aerophane into main.js

A bundler might be nice. It was break the cache for new js/css and combine showdown.

Double-check showdown uses the template.content trick.

I think it's time to add browser notifications to gigs and releases.

Have a cookie message that if you say "no" disables all embedded offsite media.

Manage Open Graph/meta data better - make a "head" include with title and meta-data
