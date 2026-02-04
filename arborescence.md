# Arborescence du Projet

```text
.
├── components.json
├── Dockerfile
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── fonts
│   │   ├── HelveticaNeueBlackItalic.otf
│   │   ├── HelveticaNeueBlack.otf
│   │   ├── HelveticaNeueBoldItalic.otf
│   │   ├── HelveticaNeueBold.otf
│   │   ├── HelveticaNeueHeavyItalic.otf
│   │   ├── HelveticaNeueHeavy.otf
│   │   ├── HelveticaNeueItalic.ttf
│   │   ├── HelveticaNeueLightItalic.otf
│   │   ├── HelveticaNeueLight.otf
│   │   ├── HelveticaNeueMediumItalic.otf
│   │   ├── HelveticaNeueMedium.otf
│   │   ├── HelveticaNeueRoman.otf
│   │   ├── HelveticaNeueThinItalic.otf
│   │   ├── HelveticaNeueThin.otf
│   │   ├── HelveticaNeueUltraLightItalic.otf
│   │   └── HelveticaNeueUltraLight.otf
│   ├── Gemini_Blog_Default_Cover.png
│   ├── globe.svg
│   ├── images
│   │   ├── apple_icon.png
│   │   ├── background.png
│   │   ├── content
│   │   │   ├── accident.png
│   │   │   ├── background1.jpg
│   │   │   ├── background2.png
│   │   │   ├── falaise.png
│   │   │   ├── highway.png
│   │   │   ├── manengouba.png
│   │   │   ├── podcast1.webp
│   │   │   ├── podcast2.jpg
│   │   │   ├── podcast3.webp
│   │   │   ├── podcast4.png
│   │   │   ├── podcast5.png
│   │   │   ├── roadsigns.png
│   │   │   └── street.png
│   │   ├── facebook.png
│   │   ├── instagram.png
│   │   ├── linkedin.png
│   │   ├── no-data.jpeg
│   │   ├── play_store.png
│   │   └── twitter.png
│   ├── logoBlack.png
│   ├── logoBlack.svg
│   ├── logoWhite.png
│   ├── logoWhite.svg
│   ├── next.svg
│   ├── play.png
│   ├── vercel.svg
│   └── window.svg
├── README.md
├── src
│   ├── app
│   │   ├── api
│   │   │   ├── auth
│   │   │   │   ├── login
│   │   │   │   │   └── route.ts
│   │   │   │   └── refresh
│   │   │   │       └── route.ts
│   │   │   └── revalidate
│   │   │       └── route.ts
│   │   ├── _app.tsx
│   │   ├── auth
│   │   │   ├── layout.tsx
│   │   │   ├── login
│   │   │   │   └── page.tsx
│   │   │   └── signup
│   │   │       └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx
│   │   ├── (protected)
│   │   │   ├── blog
│   │   │   │   ├── create
│   │   │   │   │   └── page.tsx
│   │   │   │   └── update
│   │   │   │       └── [id]
│   │   │   │           └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── newsletter
│   │   │   │   ├── create
│   │   │   │   │   └── page.tsx
│   │   │   │   └── update
│   │   │   │       └── page.tsx
│   │   │   ├── podcast
│   │   │   │   ├── create
│   │   │   │   │   └── page.tsx
│   │   │   │   └── update
│   │   │   │       └── [id]
│   │   │   │           └── page.tsx
│   │   │   ├── preview
│   │   │   │   ├── blog
│   │   │   │   │   └── [id]
│   │   │   │   │       └── page.tsx
│   │   │   │   └── podcast
│   │   │   │       └── [id]
│   │   │   │           └── page.tsx
│   │   │   ├── profile
│   │   │   │   └── [id]
│   │   │   │       └── page.tsx
│   │   │   ├── token
│   │   │   │   ├── TokenHook.tsx
│   │   │   │   └── tokenStore.tsx
│   │   │   └── u
│   │   │       ├── (adminOrganisation)
│   │   │       │   ├── authors
│   │   │       │   │   └── page.tsx
│   │   │       │   └── organisations
│   │   │       │       └── page.tsx
│   │   │       ├── category
│   │   │       │   ├── manage
│   │   │       │   │   └── page.tsx
│   │   │       │   └── page.tsx
│   │   │       ├── dashboard
│   │   │       │   └── page.tsx
│   │   │       ├── favorites
│   │   │       │   ├── blog
│   │   │       │   │   └── page.tsx
│   │   │       │   ├── layout.tsx
│   │   │       │   └── podcast
│   │   │       │       └── page.tsx
│   │   │       ├── feed
│   │   │       │   ├── blog
│   │   │       │   │   └── page.tsx
│   │   │       │   ├── create
│   │   │       │   │   └── page.tsx
│   │   │       │   ├── layout.tsx
│   │   │       │   └── podcast
│   │   │       │       └── page.tsx
│   │   │       ├── layout.tsx
│   │   │       ├── manage
│   │   │       │   ├── blogs
│   │   │       │   │   └── page.tsx
│   │   │       │   ├── newsletter
│   │   │       │   │   └── page.tsx
│   │   │       │   └── podcasts
│   │   │       │       └── page.tsx
│   │   │       ├── newsletter
│   │   │       ├── rateapp
│   │   │       │   └── page.tsx
│   │   │       ├── roles
│   │   │       │   └── page.tsx
│   │   │       ├── tags
│   │   │       │   ├── manage
│   │   │       │   │   └── page.tsx
│   │   │       │   └── page.tsx
│   │   │       └── update
│   │   │           ├── blog
│   │   │           │   └── page.tsx
│   │   │           └── podcast
│   │   │               └── index.tsx
│   │   ├── (public)
│   │   │   ├── become-an-organisation
│   │   │   │   └── page.tsx
│   │   │   ├── blog
│   │   │   │   └── [id]
│   │   │   │       └── page.tsx
│   │   │   └── podcast
│   │   │       ├── [id]
│   │   │       │   └── page.tsx
│   │   │       └── page.tsx
│   │   └── sidebar.tsx
│   ├── components
│   │   ├── AudioPlayer
│   │   │   ├── AudioPlayerContent.tsx
│   │   │   └── AudioPlayerPreview.tsx
│   │   ├── AuthForms
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignUpForm.tsx
│   │   │   └── UpdateUserForm.tsx
│   │   ├── Blog
│   │   │   ├── BlogActionAction.tsx
│   │   │   ├── blogCard.tsx
│   │   │   ├── BlogContent.tsx
│   │   │   ├── BlogCoverImage.tsx
│   │   │   ├── BlogPreview.tsx
│   │   │   ├── BlogProfileCard.tsx
│   │   │   ├── CoverBlog.tsx
│   │   │   ├── CreateBlogComponent.tsx
│   │   │   ├── HomePage.tsx
│   │   │   ├── styles
│   │   │   │   └── blogBackground.css
│   │   │   └── UpdateBlogComponent.tsx
│   │   ├── Categories
│   │   │   ├── CreateCategoryDialog.tsx
│   │   │   └── CreateDialogWrapperCategories.tsx
│   │   ├── Comment
│   │   │   ├── CommentReplyDisplay.tsx
│   │   │   ├── CommentSection.tsx
│   │   │   ├── Comment.tsx
│   │   │   └── Reply.tsx
│   │   ├── DashboardData
│   │   │   └── ContentCharts.tsx
│   │   ├── DataTable
│   │   │   ├── BlogAndPodcastDataTable.tsx
│   │   │   └── DataTable.tsx
│   │   ├── Dialogs
│   │   │   ├── BecomeAnAuthorDialog.tsx
│   │   │   ├── CreateNewAuthor.tsx
│   │   │   ├── DeleteDialog.tsx
│   │   │   ├── LogoutDialog.tsx
│   │   │   ├── RateApp.dialog.tsx
│   │   │   └── RefuseDialog.tsx
│   │   ├── Editor
│   │   │   ├── ConvertDtaftoHtml.tsx
│   │   │   ├── DraftEditor.css
│   │   │   ├── DraftEditor.tsx
│   │   │   └── Toolbar
│   │   │       └── Toolbar.tsx
│   │   ├── EmptyState
│   │   │   ├── emptyPreviewState.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── Footer
│   │   │   └── index.tsx
│   │   ├── Header
│   │   │   ├── Header1.tsx
│   │   │   ├── Header2.tsx
│   │   │   ├── HeaderWrapper.tsx
│   │   │   └── SideBarHeader.tsx
│   │   ├── Loader
│   │   │   ├── LoaderBlack.css
│   │   │   ├── LoaderBlack.tsx
│   │   │   ├── Loader.css
│   │   │   └── Loader.tsx
│   │   ├── Navigation
│   │   │   ├── NavTabsFavoris.tsx
│   │   │   ├── NavTabsMain.tsx
│   │   │   ├── NavTabsNewsLetter.tsx
│   │   │   └── Navtabs.tsx
│   │   ├── NewsLetter
│   │   │   ├── CreateNewsLetterComponents.ts
│   │   │   └── styles
│   │   ├── Organization
│   │   │   └── DisplayOrg.tsx
│   │   ├── Podcast
│   │   │   ├── CreatePodcastComponent.tsx
│   │   │   ├── HomePage.tsx
│   │   │   ├── PodcastActionButton.tsx
│   │   │   ├── podcastCard.tsx
│   │   │   ├── PodcastContent.tsx
│   │   │   ├── PodcastProfileCard.tsx
│   │   │   └── UpdatePodcastComponent.tsx
│   │   ├── preview
│   │   │   └── PreviewBlogManage.tsx
│   │   ├── Profile
│   │   │   └── ProfileClientComponent.tsx
│   │   ├── Routes
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── PublicRoute.tsx
│   │   ├── SubscribeCards
│   │   │   └── SubscribeCardLandingPage.tsx
│   │   ├── Tags
│   │   │   ├── CreateDialogWrapper.tsx
│   │   │   └── CreateTagDialog.tsx
│   │   ├── token
│   │   │   └── token.types.tsx
│   │   ├── ui
│   │   │   ├── AddToFavoritiesButton.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── command.tsx
│   │   │   ├── CommentsButton.tsx
│   │   │   ├── CreateContentIcons.tsx
│   │   │   ├── customButton.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   ├── GlobalNotifier.tsx
│   │   │   ├── ImageUpload.tsx
│   │   │   ├── input.tsx
│   │   │   ├── LandingPageWelcomeSection.tsx
│   │   │   ├── LikeDislikeButton.tsx
│   │   │   ├── MultiSelectDropdown.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── ShareButtons.tsx
│   │   │   ├── ShareButton.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── SidebarPageHeading.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── SingleComponentDropdown.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── StatusTag.tsx
│   │   │   ├── subscribeCard.tsx
│   │   │   ├── table.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── ViewsButton.tsx
│   │   └── UserAvatar
│   │       └── index.tsx
│   ├── constants
│   │   ├── baseUrl.ts
│   │   ├── entityType.ts
│   │   └── roles.ts
│   ├── context
│   │   ├── AuthContext.tsx
│   │   └── GlobalStateContext.tsx
│   ├── data
│   │   ├── RandomBlogData.tsx
│   │   ├── RandomPodcastData.tsx
│   │   └── SideBarData.tsx
│   ├── helper
│   │   ├── blobToBase64.ts
│   │   ├── calculateReadingTime.ts
│   │   ├── formatAudioDuration.ts
│   │   ├── formatDateOrRelative.ts
│   │   ├── getInitials.ts
│   │   └── TruncateText.ts
│   ├── hooks
│   │   └── use-mobile.tsx
│   ├── lib
│   │   ├── api.ts
│   │   ├── config
│   │   │   └── env.ts
│   │   ├── FetchBlogAndPodcastData.ts
│   │   ├── FetchDataFromReviewService.ts
│   │   ├── FetchDataFromUserService.ts
│   │   ├── FetchFromOrganisationData.ts
│   │   ├── helperAPIMethods.ts
│   │   └── utils.ts
│   ├── styles
│   │   └── background.css
│   └── types
│       ├── blog.ts
│       ├── category.ts
│       ├── comment.ts
│       ├── organisation.ts
│       ├── podcast.ts
│       ├── tag.ts
│       ├── userInteraction.ts
│       └── User.ts
├── tailwind.config.ts
└── tsconfig.json

105 directories, 247 files
```
