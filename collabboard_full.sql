--
-- PostgreSQL database dump
--



-- Dumped from database version 14.19 (Homebrew)
-- Dumped by pg_dump version 14.19 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: board_invitations; Type: TABLE; Schema: public; Owner: anthonyokolie
--

CREATE TABLE public.board_invitations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    board_id uuid NOT NULL,
    invited_user_id uuid NOT NULL,
    host_id uuid NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    responded_at timestamp without time zone,
    CONSTRAINT board_invitations_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'declined'::text, 'cancelled'::text])))
);


ALTER TABLE public.board_invitations OWNER TO anthonyokolie;

--
-- Name: board_members; Type: TABLE; Schema: public; Owner: anthonyokolie
--

CREATE TABLE public.board_members (
    board_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role text DEFAULT 'member'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT board_members_role_check CHECK ((role = ANY (ARRAY['owner'::text, 'admin'::text, 'member'::text, 'viewer'::text])))
);


ALTER TABLE public.board_members OWNER TO anthonyokolie;

--
-- Name: boards; Type: TABLE; Schema: public; Owner: anthonyokolie
--

CREATE TABLE public.boards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    user_id uuid NOT NULL,
    progress integer DEFAULT 0,
    owner_id uuid NOT NULL,
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.boards OWNER TO anthonyokolie;

--
-- Name: cards; Type: TABLE; Schema: public; Owner: anthonyokolie
--

CREATE TABLE public.cards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    column_id uuid,
    content text NOT NULL,
    updated_at timestamp without time zone DEFAULT now(),
    state character varying(50),
    title character varying(25)
);


ALTER TABLE public.cards OWNER TO anthonyokolie;

--
-- Name: columns; Type: TABLE; Schema: public; Owner: anthonyokolie
--

CREATE TABLE public.columns (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    board_id uuid,
    title text NOT NULL
);


ALTER TABLE public.columns OWNER TO anthonyokolie;

--
-- Name: user_friends; Type: TABLE; Schema: public; Owner: anthonyokolie
--

CREATE TABLE public.user_friends (
    user_id uuid NOT NULL,
    friend_id uuid NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT no_self_friend CHECK ((user_id <> friend_id))
);


ALTER TABLE public.user_friends OWNER TO anthonyokolie;

--
-- Name: users; Type: TABLE; Schema: public; Owner: anthonyokolie
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    profilepic text
);


ALTER TABLE public.users OWNER TO anthonyokolie;

--
-- Data for Name: board_invitations; Type: TABLE DATA; Schema: public; Owner: anthonyokolie
--

COPY public.board_invitations (id, board_id, invited_user_id, host_id, status, created_at, responded_at) FROM stdin;
06f88da5-4fee-4f18-9e7f-3d6263769f23	e2924db1-1c01-4c5d-a97b-6aaf812b5259	a7d32071-974f-4ea1-b44a-1b385d46f08d	c5751883-0106-4a58-864d-9fd4080ffecd	accepted	2026-03-14 18:23:41.720821	2026-03-14 18:23:43.299009
6416c405-6cca-41d2-b7dc-2af2790ab907	6460dc43-57c8-4f07-add6-a19c74a343dd	a7d32071-974f-4ea1-b44a-1b385d46f08d	c5751883-0106-4a58-864d-9fd4080ffecd	pending	2026-03-14 18:52:48.660784	\N
60fe3274-3840-4980-9c80-b7fb93f8da2a	61e1bba8-005a-41af-8863-e52f587181ac	c5751883-0106-4a58-864d-9fd4080ffecd	a7d32071-974f-4ea1-b44a-1b385d46f08d	pending	2026-03-15 02:26:02.765636	\N
093eec60-dc13-4785-9622-e2c0437e4b00	9eccfce2-f1eb-453b-99c4-7bb752117fe0	c5751883-0106-4a58-864d-9fd4080ffecd	a7d32071-974f-4ea1-b44a-1b385d46f08d	pending	2026-03-15 02:29:19.29938	\N
002f205c-4bf7-417a-a5ca-68cfd1637a45	bc675507-6ede-48db-ad49-17a6ff6838b8	f1a672c9-aa4e-4898-a5bd-ed5a8b342437	c5751883-0106-4a58-864d-9fd4080ffecd	pending	2026-03-15 18:23:01.437671	\N
9e5742e0-5dc9-46ce-bb88-545c6c9eb625	c8f4034f-f52d-40a5-a6cd-d808311f191d	c5751883-0106-4a58-864d-9fd4080ffecd	a7d32071-974f-4ea1-b44a-1b385d46f08d	accepted	2026-03-12 20:04:29.404594	2026-03-12 20:15:07.733815
a1345e65-818e-4bb2-a9f8-d1dfd2c81197	019d1bac-3319-4996-a78e-618a941e1723	c5751883-0106-4a58-864d-9fd4080ffecd	a7d32071-974f-4ea1-b44a-1b385d46f08d	accepted	2026-03-12 20:33:29.43123	2026-03-12 20:33:47.133781
c9a77af3-e7b9-4c17-b8fd-a5a12724927a	bc675507-6ede-48db-ad49-17a6ff6838b8	c5751883-0106-4a58-864d-9fd4080ffecd	a7d32071-974f-4ea1-b44a-1b385d46f08d	accepted	2026-03-12 20:40:13.574242	2026-03-12 20:40:29.855358
55c47e0a-5b3d-45c3-9bcd-b00f059fcec4	ebe056e9-616b-4eed-93a9-8a521a16b67b	c5751883-0106-4a58-864d-9fd4080ffecd	c5751883-0106-4a58-864d-9fd4080ffecd	declined	2026-03-12 19:59:21.870959	2026-03-13 01:23:05.636276
\.


--
-- Data for Name: board_members; Type: TABLE DATA; Schema: public; Owner: anthonyokolie
--

COPY public.board_members (board_id, user_id, role, created_at) FROM stdin;
df49842f-b60f-4908-8824-8e38601329ef	c5751883-0106-4a58-864d-9fd4080ffecd	owner	2026-03-06 21:37:36.184221
6460dc43-57c8-4f07-add6-a19c74a343dd	c5751883-0106-4a58-864d-9fd4080ffecd	owner	2026-03-07 01:19:36.710906
029520a9-1d18-4ff3-8bc0-c609109a0251	c5751883-0106-4a58-864d-9fd4080ffecd	owner	2026-03-06 21:39:10.379882
fe1d405e-18f2-4fa6-8a1d-c47ce449adf9	dd542ace-8c4a-4a51-ac13-853825d731ec	owner	2026-03-11 00:58:53.852226
508280a0-de7a-490a-9093-1e81c243552b	dd542ace-8c4a-4a51-ac13-853825d731ec	owner	2026-03-11 01:01:22.747261
34b860b6-603a-46f1-a563-7ea0ad6495bd	f1b81147-3d24-47ae-8f82-0e42f16e71b2	owner	2026-03-11 01:11:54.329697
e5518f7a-a999-4b22-83cb-7c8285a9a11f	f1b81147-3d24-47ae-8f82-0e42f16e71b2	owner	2026-03-11 01:53:02.303788
bbe16000-1a3e-4be7-a686-24d1e51f4058	f1b81147-3d24-47ae-8f82-0e42f16e71b2	owner	2026-03-11 02:08:25.484543
5c2ffda7-e267-45b9-967b-e941fbe5b039	a7d32071-974f-4ea1-b44a-1b385d46f08d	owner	2026-03-11 14:54:15.903179
5c2ffda7-e267-45b9-967b-e941fbe5b039	c5751883-0106-4a58-864d-9fd4080ffecd	member	2026-03-12 00:33:42.825126
992f513a-7f3c-4a99-9ef1-0215fbec6b22	c5751883-0106-4a58-864d-9fd4080ffecd	owner	2026-03-12 14:33:31.58219
ebe056e9-616b-4eed-93a9-8a521a16b67b	a7d32071-974f-4ea1-b44a-1b385d46f08d	owner	2026-03-12 18:10:31.955228
7d7a8b3b-84fc-47c9-b204-653fe8ca7b57	a7d32071-974f-4ea1-b44a-1b385d46f08d	owner	2026-03-12 18:12:08.348784
61e1bba8-005a-41af-8863-e52f587181ac	a7d32071-974f-4ea1-b44a-1b385d46f08d	owner	2026-03-12 18:12:52.568956
7d7a8b3b-84fc-47c9-b204-653fe8ca7b57	c5751883-0106-4a58-864d-9fd4080ffecd	member	2026-03-12 18:44:49.13513
ea4d53b0-5905-4788-aa70-15dfcf1d3a3a	a7d32071-974f-4ea1-b44a-1b385d46f08d	owner	2026-03-12 18:45:37.612906
ebe056e9-616b-4eed-93a9-8a521a16b67b	c5751883-0106-4a58-864d-9fd4080ffecd	member	2026-03-12 18:45:51.585916
c8f4034f-f52d-40a5-a6cd-d808311f191d	a7d32071-974f-4ea1-b44a-1b385d46f08d	owner	2026-03-12 20:04:20.768635
c8f4034f-f52d-40a5-a6cd-d808311f191d	c5751883-0106-4a58-864d-9fd4080ffecd	member	2026-03-12 20:15:07.733815
019d1bac-3319-4996-a78e-618a941e1723	a7d32071-974f-4ea1-b44a-1b385d46f08d	owner	2026-03-12 20:33:21.88196
019d1bac-3319-4996-a78e-618a941e1723	c5751883-0106-4a58-864d-9fd4080ffecd	member	2026-03-12 20:33:47.133781
bc675507-6ede-48db-ad49-17a6ff6838b8	a7d32071-974f-4ea1-b44a-1b385d46f08d	owner	2026-03-12 20:40:03.528525
bc675507-6ede-48db-ad49-17a6ff6838b8	c5751883-0106-4a58-864d-9fd4080ffecd	member	2026-03-12 20:40:29.855358
e2924db1-1c01-4c5d-a97b-6aaf812b5259	c5751883-0106-4a58-864d-9fd4080ffecd	owner	2026-03-14 18:23:27.502146
e2924db1-1c01-4c5d-a97b-6aaf812b5259	a7d32071-974f-4ea1-b44a-1b385d46f08d	member	2026-03-14 18:23:43.299009
9eccfce2-f1eb-453b-99c4-7bb752117fe0	a7d32071-974f-4ea1-b44a-1b385d46f08d	owner	2026-03-15 02:29:06.942052
\.


--
-- Data for Name: boards; Type: TABLE DATA; Schema: public; Owner: anthonyokolie
--

COPY public.boards (id, title, created_at, user_id, progress, owner_id, updated_at) FROM stdin;
e2924db1-1c01-4c5d-a97b-6aaf812b5259	test board $	2026-03-14 18:23:27.502146	c5751883-0106-4a58-864d-9fd4080ffecd	100	c5751883-0106-4a58-864d-9fd4080ffecd	2026-03-14 18:23:27.502146
df49842f-b60f-4908-8824-8e38601329ef	Smino	2026-03-06 21:37:36.184221	c5751883-0106-4a58-864d-9fd4080ffecd	0	c5751883-0106-4a58-864d-9fd4080ffecd	2026-03-10 14:50:25.045988
fe1d405e-18f2-4fa6-8a1d-c47ce449adf9	my first board	2026-03-11 00:58:53.852226	dd542ace-8c4a-4a51-ac13-853825d731ec	0	dd542ace-8c4a-4a51-ac13-853825d731ec	2026-03-11 00:58:53.852226
508280a0-de7a-490a-9093-1e81c243552b	second board	2026-03-11 01:01:22.747261	dd542ace-8c4a-4a51-ac13-853825d731ec	0	dd542ace-8c4a-4a51-ac13-853825d731ec	2026-03-11 01:01:22.747261
34b860b6-603a-46f1-a563-7ea0ad6495bd	my first board	2026-03-11 01:11:54.329697	f1b81147-3d24-47ae-8f82-0e42f16e71b2	0	f1b81147-3d24-47ae-8f82-0e42f16e71b2	2026-03-11 01:11:54.329697
e5518f7a-a999-4b22-83cb-7c8285a9a11f	my second board	2026-03-11 01:53:02.303788	f1b81147-3d24-47ae-8f82-0e42f16e71b2	0	f1b81147-3d24-47ae-8f82-0e42f16e71b2	2026-03-11 01:53:02.303788
bbe16000-1a3e-4be7-a686-24d1e51f4058	third board	2026-03-11 02:08:25.484543	f1b81147-3d24-47ae-8f82-0e42f16e71b2	0	f1b81147-3d24-47ae-8f82-0e42f16e71b2	2026-03-11 02:08:25.484543
5c2ffda7-e267-45b9-967b-e941fbe5b039	my first board	2026-03-11 14:54:15.903179	a7d32071-974f-4ea1-b44a-1b385d46f08d	0	a7d32071-974f-4ea1-b44a-1b385d46f08d	2026-03-11 14:54:15.903179
992f513a-7f3c-4a99-9ef1-0215fbec6b22	test board	2026-03-12 14:33:31.58219	c5751883-0106-4a58-864d-9fd4080ffecd	0	c5751883-0106-4a58-864d-9fd4080ffecd	2026-03-12 14:33:31.58219
ebe056e9-616b-4eed-93a9-8a521a16b67b	board test	2026-03-12 18:10:31.955228	a7d32071-974f-4ea1-b44a-1b385d46f08d	0	a7d32071-974f-4ea1-b44a-1b385d46f08d	2026-03-12 18:10:31.955228
7d7a8b3b-84fc-47c9-b204-653fe8ca7b57	test board	2026-03-12 18:12:08.348784	a7d32071-974f-4ea1-b44a-1b385d46f08d	0	a7d32071-974f-4ea1-b44a-1b385d46f08d	2026-03-12 18:12:08.348784
ea4d53b0-5905-4788-aa70-15dfcf1d3a3a	family guy	2026-03-12 18:45:37.612906	a7d32071-974f-4ea1-b44a-1b385d46f08d	0	a7d32071-974f-4ea1-b44a-1b385d46f08d	2026-03-12 18:45:37.612906
c8f4034f-f52d-40a5-a6cd-d808311f191d	avatar	2026-03-12 20:04:20.768635	a7d32071-974f-4ea1-b44a-1b385d46f08d	0	a7d32071-974f-4ea1-b44a-1b385d46f08d	2026-03-12 20:04:20.768635
bc675507-6ede-48db-ad49-17a6ff6838b8	easter	2026-03-12 20:40:03.528525	a7d32071-974f-4ea1-b44a-1b385d46f08d	0	a7d32071-974f-4ea1-b44a-1b385d46f08d	2026-03-12 20:40:03.528525
61e1bba8-005a-41af-8863-e52f587181ac	huck finn	2026-03-12 18:12:52.568956	a7d32071-974f-4ea1-b44a-1b385d46f08d	0	a7d32071-974f-4ea1-b44a-1b385d46f08d	2026-03-15 02:26:27.839321
9eccfce2-f1eb-453b-99c4-7bb752117fe0	steelers fan	2026-03-15 02:29:06.942052	a7d32071-974f-4ea1-b44a-1b385d46f08d	0	a7d32071-974f-4ea1-b44a-1b385d46f08d	2026-03-15 02:29:41.545396
6460dc43-57c8-4f07-add6-a19c74a343dd	Call me willie beamen	2026-03-07 01:19:36.710906	c5751883-0106-4a58-864d-9fd4080ffecd	0	c5751883-0106-4a58-864d-9fd4080ffecd	2026-03-07 01:19:36.710906
029520a9-1d18-4ff3-8bc0-c609109a0251	Praise is fat	2026-03-06 21:39:10.379882	c5751883-0106-4a58-864d-9fd4080ffecd	50	c5751883-0106-4a58-864d-9fd4080ffecd	2026-03-06 21:39:10.379882
019d1bac-3319-4996-a78e-618a941e1723	christmas	2026-03-12 20:33:21.88196	a7d32071-974f-4ea1-b44a-1b385d46f08d	50	a7d32071-974f-4ea1-b44a-1b385d46f08d	2026-03-12 20:33:21.88196
\.


--
-- Data for Name: cards; Type: TABLE DATA; Schema: public; Owner: anthonyokolie
--

COPY public.cards (id, column_id, content, updated_at, state, title) FROM stdin;
02207f25-29cb-4361-8f5f-3ea3c5b5e8ae	\N	header	2026-02-09 00:15:59.876637	completed	\N
316f6456-e2a6-48f6-9ff2-a62749276c90	\N	2	2026-02-26 01:56:25.191166	completed	\N
ae49dc05-adf3-433e-bc68-6709373fa991	\N	2	2026-02-26 01:59:49.59378	completed	\N
d94b2ab7-a1f8-4466-9b87-828361556f05	\N	Completed task?	2026-03-06 02:11:36.696605	\N	Task 3
734c0f2f-2169-45cc-a8a3-ba419e5193a3	\N	Lets see if the progress bar works	2026-03-06 02:13:54.146824	\N	First completed task
6fba6ec1-cb3e-43cb-bc41-2485adbe9693	\N	Lets see if the progress bar works	2026-03-06 03:14:19.380937	\N	Task 1
35126aaa-bb16-4ffa-85bb-80d5d7955229	\N	I am making a note to allow us to test if the add card works	2026-03-06 03:14:24.404788	\N	test card
c0008131-a29f-4354-b2e8-a724291491a1	\N	testing my draggable/droppable cards	2026-03-06 14:07:06.951207	\N	Completed task
a61f537b-974e-4dcc-b908-ebb5c4878c2b	\N	vhwvdw	2026-03-06 14:15:56.465506	\N	Task 2
af62107d-2bca-4d55-8d43-10d419499df7	\N	card under review	2026-03-06 14:21:30.076223	\N	review card
e93aa7f6-34c2-4f96-b29d-fd270a09bb5b	\N	lets see if I can make you completed	2026-03-06 14:26:15.011379	\N	review under card 2
ef739c3e-abb4-4fcf-bde8-412c426910d1	\N	try this again	2026-03-06 14:37:17.870261	\N	review under card 3
c51cb4ba-69f3-440c-829c-745e10104d1e	e3e061b6-85f3-4468-becb-6b6efb0084fb	let bygones be bygones	2026-03-14 18:24:06.872576	\N	bygones
dad18a4a-af68-41fd-87b5-332f3162376b	e3e061b6-85f3-4468-becb-6b6efb0084fb	idl	2026-03-15 01:49:15.67094	\N	something else
72ef9b51-5ae0-4003-bf73-4a6580e055b3	45695021-be1f-4e73-b34b-eeecf4d0ab81	Stay off my grass like Stanley	2026-03-06 21:38:27.098894	\N	Trina
e0329ffc-c08f-4c63-b662-6209a1960d54	0a725ad3-c364-4784-8206-d06cdd1f7788	test	2026-03-06 21:40:20.210724	\N	has
e2c324f6-04a0-4632-9bcb-783be6765586	96217154-681b-474c-b74f-4f93246d7655	workout some more	2026-03-09 21:01:06.267447	\N	lose weight
28e99378-dc87-415b-b071-3b7c0217cb7e	066d0bcd-533f-4091-822a-d88901a27dbe	Like lee and love	2026-03-13 01:21:53.176932	\N	Lets get old
56d4ed23-c612-4884-a2a2-e2df8eb4eab0	02d2ad9b-b0f7-4109-a29a-dce050ca89ce	Something about jess	2026-03-13 01:22:38.936218	\N	new girl
\.


--
-- Data for Name: columns; Type: TABLE DATA; Schema: public; Owner: anthonyokolie
--

COPY public.columns (id, board_id, title) FROM stdin;
d90dc29a-ae03-411c-abf8-9fe644fd72e3	df49842f-b60f-4908-8824-8e38601329ef	To Do
45695021-be1f-4e73-b34b-eeecf4d0ab81	df49842f-b60f-4908-8824-8e38601329ef	In Progress
d6cbeffe-d822-4a60-b35a-223b1b393370	df49842f-b60f-4908-8824-8e38601329ef	Completed
96217154-681b-474c-b74f-4f93246d7655	029520a9-1d18-4ff3-8bc0-c609109a0251	To Do
2d17c3e1-b2aa-4fe4-bf7c-d1fe41e522e8	029520a9-1d18-4ff3-8bc0-c609109a0251	In Progress
0a725ad3-c364-4784-8206-d06cdd1f7788	029520a9-1d18-4ff3-8bc0-c609109a0251	Completed
8bcb6a9c-5306-41bf-8a63-2b210e1f1735	6460dc43-57c8-4f07-add6-a19c74a343dd	To Do
b90ce9b5-a561-4685-9d23-30e43ddcce80	6460dc43-57c8-4f07-add6-a19c74a343dd	In Progress
bcc4d178-0d40-42bc-8784-ba8f485d8fd1	6460dc43-57c8-4f07-add6-a19c74a343dd	Completed
37ece63f-f7d9-44b1-8614-440e9a410f22	6460dc43-57c8-4f07-add6-a19c74a343dd	Modennaminute
b3042909-96e2-459c-868c-af4434a6e23c	fe1d405e-18f2-4fa6-8a1d-c47ce449adf9	To Do
7137af18-e772-4c23-8b04-09bc8a324585	fe1d405e-18f2-4fa6-8a1d-c47ce449adf9	In Progress
83514879-6d8d-49f1-8573-fca75a0cff56	fe1d405e-18f2-4fa6-8a1d-c47ce449adf9	Completed
ad9ecfc8-6dcf-43a4-b44b-2140ea572da3	508280a0-de7a-490a-9093-1e81c243552b	To Do
064fd879-9638-4dd3-be7d-c855e4666fde	508280a0-de7a-490a-9093-1e81c243552b	In Progress
f6fb29dc-47a5-4e14-b4ec-811335bd18ce	508280a0-de7a-490a-9093-1e81c243552b	Completed
652cdb8b-e204-4e36-9625-a35f7c0c3311	34b860b6-603a-46f1-a563-7ea0ad6495bd	To Do
5080df61-fb05-4c63-8e92-082f02c8505c	34b860b6-603a-46f1-a563-7ea0ad6495bd	In Progress
75ac9391-11e4-4787-8bef-0921ca983738	34b860b6-603a-46f1-a563-7ea0ad6495bd	Completed
9034f873-0142-42b8-af69-bbaafc6eabc3	e5518f7a-a999-4b22-83cb-7c8285a9a11f	To Do
7500e44e-15f7-423a-9679-1d53a1942759	e5518f7a-a999-4b22-83cb-7c8285a9a11f	In Progress
5db34173-0cd1-4f36-8017-cd41bf16837d	e5518f7a-a999-4b22-83cb-7c8285a9a11f	Completed
0f007cab-d9a5-4bda-b875-85aec0faf260	bbe16000-1a3e-4be7-a686-24d1e51f4058	To Do
49ec760f-3b5a-40c3-a754-056e4376bc78	bbe16000-1a3e-4be7-a686-24d1e51f4058	In Progress
2f0f45f6-e75d-4677-a5cc-5df17ac854db	bbe16000-1a3e-4be7-a686-24d1e51f4058	Completed
1439b6d3-9c10-4445-a5f1-0d433efd7075	5c2ffda7-e267-45b9-967b-e941fbe5b039	To Do
7d8ac093-d360-40c5-a3ea-c3ad6d455a22	5c2ffda7-e267-45b9-967b-e941fbe5b039	In Progress
7b2527f6-836d-4cc8-b332-792b50cc788d	5c2ffda7-e267-45b9-967b-e941fbe5b039	Completed
3cfdaf79-1470-422a-ac4e-1142f4a9ebf4	992f513a-7f3c-4a99-9ef1-0215fbec6b22	To Do
14594db9-55af-4f2f-bb42-d9ccb9f5248f	992f513a-7f3c-4a99-9ef1-0215fbec6b22	In Progress
34b26a29-38ed-402b-8aa6-a7253a276d39	992f513a-7f3c-4a99-9ef1-0215fbec6b22	Completed
23403bfb-8951-4d96-a446-b3900676d40c	ebe056e9-616b-4eed-93a9-8a521a16b67b	To Do
f40146ba-066a-4ef1-ba7c-e814973555ad	ebe056e9-616b-4eed-93a9-8a521a16b67b	In Progress
f082ea86-f661-4ebd-85a2-8c296d544371	ebe056e9-616b-4eed-93a9-8a521a16b67b	Completed
76db95e2-8878-4961-a95c-e7a3535d1470	7d7a8b3b-84fc-47c9-b204-653fe8ca7b57	To Do
991267ba-313d-43d1-b344-eb2778e0da17	7d7a8b3b-84fc-47c9-b204-653fe8ca7b57	In Progress
1ca9ddf5-4e41-434b-b18c-a7b428d198d4	7d7a8b3b-84fc-47c9-b204-653fe8ca7b57	Completed
c0c8208f-6bee-410c-95c5-4879a1e327b6	61e1bba8-005a-41af-8863-e52f587181ac	To Do
ad7cf6da-f7b7-4f21-bc87-b326026f4d61	61e1bba8-005a-41af-8863-e52f587181ac	In Progress
a017bf2a-c7ca-40ac-8d2c-e13b737df548	61e1bba8-005a-41af-8863-e52f587181ac	Completed
94ba7c4a-f6f9-4795-a465-a859e4177f3e	019d1bac-3319-4996-a78e-618a941e1723	to Lee
79c3ac43-b107-4634-bfc9-a940a4674ec7	019d1bac-3319-4996-a78e-618a941e1723	To Lovie
e73cbc92-df5f-432d-925e-da1274686345	019d1bac-3319-4996-a78e-618a941e1723	myself
780d135d-ccb6-40b6-9202-4c34673c38d2	e2924db1-1c01-4c5d-a97b-6aaf812b5259	To Do
344154af-aab2-486a-94d4-650e1aa71f9b	e2924db1-1c01-4c5d-a97b-6aaf812b5259	In Progress
4a465add-d2a8-42e6-b6f0-d94641ffc351	ea4d53b0-5905-4788-aa70-15dfcf1d3a3a	To Do
df63df4c-2810-41cc-a645-fa7d1b3d7f5a	ea4d53b0-5905-4788-aa70-15dfcf1d3a3a	In Progress
301a7757-91ee-489a-a850-e809075df7cb	ea4d53b0-5905-4788-aa70-15dfcf1d3a3a	Completed
e3e061b6-85f3-4468-becb-6b6efb0084fb	e2924db1-1c01-4c5d-a97b-6aaf812b5259	Completed
91b5bbd2-72c4-4236-8ca9-cb148ff4bac3	c8f4034f-f52d-40a5-a6cd-d808311f191d	To Do
4549c10c-1a0e-46e2-bbb2-eec90869a716	c8f4034f-f52d-40a5-a6cd-d808311f191d	In Progress
7b0b96f8-e0e8-498c-a598-e4455f306731	c8f4034f-f52d-40a5-a6cd-d808311f191d	Completed
07662cca-e012-4d7f-be73-77366f9204ce	e2924db1-1c01-4c5d-a97b-6aaf812b5259	test col
71f23b2c-b4cf-4df6-8087-93d6392a6fef	e2924db1-1c01-4c5d-a97b-6aaf812b5259	stacey dash
c5bb5bd8-0179-4151-9a6d-32db66650a03	9eccfce2-f1eb-453b-99c4-7bb752117fe0	To Do
2310aa62-c59b-497a-933e-4f5ea8a03ce5	9eccfce2-f1eb-453b-99c4-7bb752117fe0	In Progress
4139f338-98d0-4d26-bcc4-d529e8f63d06	9eccfce2-f1eb-453b-99c4-7bb752117fe0	Completed
ef1e4423-af99-4ded-9155-b74d0951d6bf	019d1bac-3319-4996-a78e-618a941e1723	To Do
02d2ad9b-b0f7-4109-a29a-dce050ca89ce	019d1bac-3319-4996-a78e-618a941e1723	In Progress
066d0bcd-533f-4091-822a-d88901a27dbe	019d1bac-3319-4996-a78e-618a941e1723	Completed
b891b724-edb9-4efe-8d2c-b60e5e863b03	bc675507-6ede-48db-ad49-17a6ff6838b8	To Do
0a0bcaed-0909-46e3-a4ce-3a7a282abe24	bc675507-6ede-48db-ad49-17a6ff6838b8	In Progress
a0945e09-a89a-4721-a2d7-3cc32359ce07	bc675507-6ede-48db-ad49-17a6ff6838b8	Completed
\.


--
-- Data for Name: user_friends; Type: TABLE DATA; Schema: public; Owner: anthonyokolie
--

COPY public.user_friends (user_id, friend_id, status, created_at) FROM stdin;
c5751883-0106-4a58-864d-9fd4080ffecd	dd542ace-8c4a-4a51-ac13-853825d731ec	pending	2026-03-10 17:51:57.66234
c5751883-0106-4a58-864d-9fd4080ffecd	f1b81147-3d24-47ae-8f82-0e42f16e71b2	pending	2026-03-10 17:57:29.886552
c5751883-0106-4a58-864d-9fd4080ffecd	995b2c00-f378-4794-ac12-ab5687e8cd95	pending	2026-03-10 17:57:47.427459
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: anthonyokolie
--

COPY public.users (id, email, username, password, profilepic) FROM stdin;
dd542ace-8c4a-4a51-ac13-853825d731ec	id@gmail.com	Anthony	$2b$10$yP29OyJbA9lhVO.BbYe9e.dHWRNXPmkHKWK9AQwbqIlaqJ4ps0Iiq	\N
1b90d41d-fb8a-43d9-9986-90daa461296d	id1@gmail.com	A	$2b$10$Ex3TKCYQ409pPCVQ3zHhO.i1ehhgGAnhqXPP.M9iwVVdt.Vt1JXhm	\N
e8c4f806-22ca-4797-82e0-7bd4295096ca	a1@gmail.com	A	$2b$10$FCaBA/lcs5qjpZTRrKtWK.0SMYInk/0aCAQy1Rq43Q8QZ0Gonqpv.	\N
f1b81147-3d24-47ae-8f82-0e42f16e71b2	2@gmail.com	Anthony Okolie	$2b$10$j1hB9tALB1oVOivgnL8buO4NubjUn7EHGa2WFfO1jXaEyIlRA0.l2	\N
995b2c00-f378-4794-ac12-ab5687e8cd95	2@gmail.com	Anthony	$2b$10$9whvqmK4TEkDewaaCDPfeeQC1ssrmJu/JJ/lY/r1dx6Z3EdA/CQZu	\N
f1a672c9-aa4e-4898-a5bd-ed5a8b342437	24@gmail.com	Anthony Okolie	$2b$10$vuj2P1uOraaxr3uo.ktwx.KOckszhbAbtGJcVvtXBd4YR.TMRz2nK	\N
1f2af397-d31b-42a1-bbb6-5fecdf85ff7d	a2@gmail.com	Anthony	$2b$10$9PHQSkGKDH2F0sw1qK0K3.f22vQ5hFJ7z2PMrYQKsfkQzIDYWQAM2	\N
f981469a-161f-47bc-a709-8008a44cd7a1	a24@gmail.com	Anthony	$2b$10$IfByDw8QkRJsB7y6/0edZOQ1dn.b7eanMX9k6Yg9QaG5vki.Rsxre	\N
2f33db58-9f96-44ba-9d94-83835d696fd7	13@gmail.com	Anthony	$2b$10$7TP6LCK4bNHPxP..l0OJB.QwRQPhosDSRAN/IAr.P3jYdhXhp7oMO	\N
c5751883-0106-4a58-864d-9fd4080ffecd	12@gmail.com	Anthony Okolie	$2b$10$9j/P2lHFFFKh4enr8.MNnuV7o.GPZ2yFKUMfezI8cqRquk7e8GKiy	https://res.cloudinary.com/dz8dqpkso/image/upload/v1772881831/xschqnhiignettckc86k.jpg
a7d32071-974f-4ea1-b44a-1b385d46f08d	11@gmail.com	Anthony Okolie	$2b$10$M.2vNZHFhoM3gV9PITSgye7oqxterzaOt0UuHrt/KwoAlLTYr0Er6	https://res.cloudinary.com/dz8dqpkso/image/upload/v1773532251/hdo1jgch4jd8h5jav5tn.png
\.


--
-- Name: board_invitations board_invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: anthonyokolie
--

ALTER TABLE ONLY public.board_invitations
    ADD CONSTRAINT board_invitations_pkey PRIMARY KEY (id);


--
-- Name: board_members board_members_pkey; Type: CONSTRAINT; Schema: public; Owner: anthonyokolie
--

ALTER TABLE ONLY public.board_members
    ADD CONSTRAINT board_members_pkey PRIMARY KEY (board_id, user_id);


--
-- Name: boards boards_pkey; Type: CONSTRAINT; Schema: public; Owner: anthonyokolie
--

ALTER TABLE ONLY public.boards
    ADD CONSTRAINT boards_pkey PRIMARY KEY (id);


--
-- Name: cards cards_pkey; Type: CONSTRAINT; Schema: public; Owner: anthonyokolie
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT cards_pkey PRIMARY KEY (id);


--
-- Name: columns columns_pkey; Type: CONSTRAINT; Schema: public; Owner: anthonyokolie
--

ALTER TABLE ONLY public.columns
    ADD CONSTRAINT columns_pkey PRIMARY KEY (id);


--
-- Name: user_friends user_friends_pkey; Type: CONSTRAINT; Schema: public; Owner: anthonyokolie
--

ALTER TABLE ONLY public.user_friends
    ADD CONSTRAINT user_friends_pkey PRIMARY KEY (user_id, friend_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: anthonyokolie
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: unique_pending_invite; Type: INDEX; Schema: public; Owner: anthonyokolie
--

CREATE UNIQUE INDEX unique_pending_invite ON public.board_invitations USING btree (board_id, invited_user_id) WHERE (status = 'pending'::text);


--
-- Name: cards cards_column_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: anthonyokolie
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT cards_column_id_fkey FOREIGN KEY (column_id) REFERENCES public.columns(id) ON DELETE CASCADE;


--
-- Name: columns columns_board_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: anthonyokolie
--

ALTER TABLE ONLY public.columns
    ADD CONSTRAINT columns_board_id_fkey FOREIGN KEY (board_id) REFERENCES public.boards(id) ON DELETE CASCADE;


--
-- Name: board_invitations fk_board; Type: FK CONSTRAINT; Schema: public; Owner: anthonyokolie
--

ALTER TABLE ONLY public.board_invitations
    ADD CONSTRAINT fk_board FOREIGN KEY (board_id) REFERENCES public.boards(id) ON DELETE CASCADE;


--
-- Name: board_members fk_board_members_board; Type: FK CONSTRAINT; Schema: public; Owner: anthonyokolie
--

ALTER TABLE ONLY public.board_members
    ADD CONSTRAINT fk_board_members_board FOREIGN KEY (board_id) REFERENCES public.boards(id) ON DELETE CASCADE;


--
-- Name: board_members fk_board_members_user; Type: FK CONSTRAINT; Schema: public; Owner: anthonyokolie
--

ALTER TABLE ONLY public.board_members
    ADD CONSTRAINT fk_board_members_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: boards fk_boards_owner; Type: FK CONSTRAINT; Schema: public; Owner: anthonyokolie
--

ALTER TABLE ONLY public.boards
    ADD CONSTRAINT fk_boards_owner FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: boards fk_boards_user; Type: FK CONSTRAINT; Schema: public; Owner: anthonyokolie
--

ALTER TABLE ONLY public.boards
    ADD CONSTRAINT fk_boards_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_friends fk_friend; Type: FK CONSTRAINT; Schema: public; Owner: anthonyokolie
--

ALTER TABLE ONLY public.user_friends
    ADD CONSTRAINT fk_friend FOREIGN KEY (friend_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: board_invitations fk_host_id; Type: FK CONSTRAINT; Schema: public; Owner: anthonyokolie
--

ALTER TABLE ONLY public.board_invitations
    ADD CONSTRAINT fk_host_id FOREIGN KEY (host_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: board_invitations fk_invited_user_id; Type: FK CONSTRAINT; Schema: public; Owner: anthonyokolie
--

ALTER TABLE ONLY public.board_invitations
    ADD CONSTRAINT fk_invited_user_id FOREIGN KEY (invited_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_friends fk_user; Type: FK CONSTRAINT; Schema: public; Owner: anthonyokolie
--

ALTER TABLE ONLY public.user_friends
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--



