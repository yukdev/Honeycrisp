import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { FaExternalLinkAlt } from 'react-icons/fa';
import DemoTask from '@/components/DemoTask';
import Link from 'next/link';

const DemoPage = async () => {
  const userSession = (await getServerSession(authOptions)) as any;

  const {
    user: {
      demoData: { session1Id, session2Id, session3Id },
    },
  } = userSession;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center my-8">
      <section id="intro" className="mb-5">
        <h1 className="text-accent text-3xl font-bold">Hey there!</h1>
        <h2 className="text-xl font-semibold">
          Thanks for checking out my bill-management app!
        </h2>
        <h3 className="text-lg mb-2">
          Let&apos;s get you started with the demo.
        </h3>
      </section>
      <section id="demo-sessions">
        <h3 className="text-lg mb-8">
          I&apos;ve went ahead and created 3{' '}
          <b className="text-accent">sessions</b> for you.
        </h3>
        <div className="text-lg px-5">
          <div className="bg-base-100 rounded-box p-5">
            <span className="flex justify-center items-center">
              <h3 className="text-2xl text-secondary font-bold">
                Golden Lotus Dim Sum
              </h3>
              <Link href={`/sessions/${session1Id}`}>
                <FaExternalLinkAlt className="ml-2 text-info" />
              </Link>
            </span>
            <h4>Aaron invites you and Bobby out for dimsum.</h4>
            <div className="mt-2 flex flex-col">
              <div className="flex space-x-2 items-center">
                <DemoTask taskName="confirm-items" />
                <p>
                  <b>Confirm</b> more items you ate
                </p>
              </div>
              <div className="flex space-x-2 items-center">
                <DemoTask taskName="share-session" />
                <p>
                  <b>Share</b> the session link
                </p>
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-xl underline">Notice the following:</h3>
              <h4>
                The amount you <b>potentially owe</b> changes as you confirm
                items you ate.
              </h4>
            </div>
          </div>
          <div className="divider"></div>
          <div className="bg-base-100 rounded-box p-5">
            <span className="flex justify-center items-center">
              <h3 className="text-2xl text-secondary font-bold">
                Tsunami Seafood Boil
              </h3>
              <Link href={`/sessions/${session3Id}`}>
                <FaExternalLinkAlt className="ml-2 text-info" />
              </Link>
            </span>
            <h4>You paid the bill for this seafood boil outing.</h4>
            <h4>You realize you didn&apos;t actually eat any chicken wings.</h4>
            <h4>
              You actually had french fries, which you forgot to add to the
              session.
            </h4>
            <div className="mt-2 flex flex-col">
              <div className="flex space-x-2 items-center">
                <DemoTask taskName="mark-paid" />
                <p className="text-left">
                  Mark that Derek <b>paid</b> you
                </p>
              </div>
              <div className="flex space-x-2 items-center">
                <DemoTask taskName="unfinalize-session" />
                <p className="text-left">
                  <b>Unfinalize</b> the session
                </p>
              </div>
              <div className="flex space-x-2 items-center">
                <DemoTask taskName="unconfirm-items" />
                <p className="text-left">
                  <b>Unconfirm</b> you ate the chicken wings
                </p>
              </div>
              <div className="flex space-x-2 items-center">
                <DemoTask taskName="edit-session" />
                <p className="text-left">
                  <b>Edit</b> the session by adding french fries
                </p>
              </div>
              <div className="flex space-x-2 items-center">
                <DemoTask taskName="confirm-and-finalize-session" />
                <p className="text-left">
                  <b>Confirm</b> you ate the french fries and <b>finalize</b>{' '}
                  the session
                </p>
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-xl underline">Notice the following:</h3>
              <h4>
                The <b>total</b> will update accordingly to your changes.
              </h4>
              <h4>
                There is a <b>running total</b> that updates live as you change
                items.
              </h4>
            </div>
          </div>
          <div className="divider"></div>
          <div className="bg-base-100 rounded-box p-5">
            <span className="flex justify-center items-center">
              <h3 className="text-2xl text-secondary font-bold">
                Sahib Indian Cuisine
              </h3>
              <Link href={`/sessions/${session2Id}`}>
                <FaExternalLinkAlt className="ml-2 text-info" />
              </Link>
            </span>
            <h4>You paid the bill at this company lunch.</h4>
            <h4>Felix hasn&apos;t used this app before.</h4>
            <div className="mt-2 flex flex-col">
              <div className="flex space-x-2 items-center">
                <DemoTask taskName="add-gust" />
                <p className="text-left">
                  Add Felix as a <b>guest</b>
                </p>
              </div>
              <div className="flex space-x-2 items-center">
                <DemoTask taskName="select-guest" />
                <p className="text-left">
                  <b>Select</b> Felix to confirm items on his behalf
                </p>
              </div>
              <div className="flex space-x-2 items-center">
                <DemoTask taskName="confirm-for-guest" />
                <p className="text-left">
                  <b>Confirm</b> for Felix he ate the chicken korma and the naan
                </p>
              </div>
              <div className="flex space-x-2 items-center">
                <DemoTask taskName="finalize-guest-session" />
                <p className="text-left">
                  <b>Finalize</b> the session
                </p>
              </div>
              <div className="flex space-x-2 items-center">
                <DemoTask taskName="check-split" />
                <p className="text-left">
                  Check out the bill and item <b>split</b> by clicking the tabs
                </p>
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-xl underline">Notice the following:</h3>
              <h4>
                When you have a guest <b>selected</b>, it&apos;ll appear as if
                you are the guest.
              </h4>
            </div>
          </div>
          <div className="divider"></div>
          <div className="bg-base-100 rounded-box p-5">
            <h2 className="text-2xl font-bold">All Done? Try these too!</h2>
            <div className="mt-2 flex flex-col">
              <div className="flex space-x-2 items-center">
                <DemoTask taskName="create-session" />
                <p className="text-left">Create a new session</p>
              </div>
              <div className="flex space-x-2 items-center">
                <DemoTask taskName="leave-session" />
                <p className="text-left">
                  &quot;Leave&quot; this{' '}
                  <Link
                    className="font-bold text-secondary"
                    href={`/sessions/${session1Id}`}
                  >
                    session
                  </Link>{' '}
                  by <b>unconfirming</b> all items selected
                </p>
              </div>
              <div className="flex space-x-2 items-center">
                <DemoTask taskName="view-sessions" />
                <p className="text-left">
                  View your sesssions via the nav bar - that session will be
                  gone
                </p>
              </div>
              <div className="flex space-x-2 items-center">
                <DemoTask taskName="join-session" />
                <p className="text-left">
                  &quot;Join&quot; the{' '}
                  <Link
                    className="font-bold text-secondary"
                    href={`/sessions/${session1Id}`}
                  >
                    session
                  </Link>{' '}
                  by confirming you ate one or more of the items.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DemoPage;
