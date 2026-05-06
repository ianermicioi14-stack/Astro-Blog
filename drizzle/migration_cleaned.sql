CREATE TABLE [comments] (
	[id] int IDENTITY(1, 1),
	[post_id] int NOT NULL,
	[author_id] int,
	[username] nvarchar(255) NOT NULL,
	[content] nvarchar(max) NOT NULL,
	[created_at] datetime NOT NULL,
	CONSTRAINT [comments_pkey] PRIMARY KEY([id])
);

GO

CREATE TABLE [posts] (
	[id] int IDENTITY(1, 1),
	[title] nvarchar(255) NOT NULL,
	[slug] nvarchar(255) NOT NULL,
	[excerpt] nvarchar(1000) NOT NULL,
	[content] nvarchar(max) NOT NULL,
	[image] nvarchar(255),
	[author_id] int,
	[created_at] datetime NOT NULL,
	CONSTRAINT [posts_pkey] PRIMARY KEY([id]),
	CONSTRAINT [posts_slug_key] UNIQUE([slug])
);

GO

CREATE TABLE [users] (
	[id] int IDENTITY(1, 1),
	[username] nvarchar(255) NOT NULL,
	[email] nvarchar(255) NOT NULL,
	[password_hash] nvarchar(255) NOT NULL,
	[is_admin] bit NOT NULL CONSTRAINT [users_is_admin_default] DEFAULT ((0)),
	[created_at] datetime NOT NULL,
	CONSTRAINT [users_pkey] PRIMARY KEY([id]),
	CONSTRAINT [users_username_key] UNIQUE([username]),
	CONSTRAINT [users_email_key] UNIQUE([email])
);

GO

ALTER TABLE [comments] ADD CONSTRAINT [comments_post_id_posts_id_fk] FOREIGN KEY ([post_id]) REFERENCES [posts]([id]);
GO

ALTER TABLE [comments] ADD CONSTRAINT [comments_author_id_users_id_fk] FOREIGN KEY ([author_id]) REFERENCES [users]([id]);
GO

ALTER TABLE [posts] ADD CONSTRAINT [posts_author_id_users_id_fk] FOREIGN KEY ([author_id]) REFERENCES [users]([id]);
