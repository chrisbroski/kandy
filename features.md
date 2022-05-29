# Development Prioritization

## For Next Deploy

* https (needed for notifications)
* Tip jar x
* api shortcut x
* open graph head include x
* Photo upload x

## Features

### Notifications

### Tip Jar Page

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

I think it's time to add browser notifications to gigs and releases.

Have a cookie message that if you say "no" disables all embedded offsite media.

If you put a Spotify individual track in album media, it breaks stuff. Allow a track URL.

## Questions

Do we really want or need the embedded players and maps? They add a lot of bloat and 3rd party cookies.
