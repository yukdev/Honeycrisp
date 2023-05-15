import Link from 'next/link';

const DemoPage = () => {
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
            <h3 className="text-2xl text-secondary font-bold">
              Golden Lotus Dim Sum
            </h3>
            <h3>Aaron invited you and Bobby out to dimsum.</h3>
            <h3>Aaron paid the bill.</h3>
            <h3>
              I&apos;ve went ahead and <b className="text-accent">confirmed</b>{' '}
              one of the items you ate.
            </h3>
            <h3>Feel free to mark some more.</h3>
            <h3>
              Notice how the amount you{' '}
              <b className="text-accent">potentially owe</b> changes as you
              confirm items.
            </h3>
            <h3>Try sharing the session with your coworker Cindy.</h3>
            <h3>
              Maybe she&apos;d like to come next time if she thinks the prices
              are good!
            </h3>
          </div>
          <div className="divider"></div>
          <div className="bg-base-100 rounded-box p-5">
            <h3 className="text-2xl text-secondary font-bold">
              Tsunami Seafood Boil
            </h3>
            <h3>You came here with your friends: Aaron and Derek.</h3>
            <h3>
              You paid the bill so you are automatically marked as having{' '}
              <b className="text-accent">paid</b>.
            </h3>
            <h3>
              You remember Derek paying you in cash, so let&apos;s mark him as
              having paid.
            </h3>
            <h3>
              You can see that this session is{' '}
              <b className="text-accent">finalized</b>.
            </h3>
            <h3>This can only be done by the host.</h3>
            <h3>It indicates that everyone has confirmed what they ate.</h3>
            <h3>
              As the host, you have the ability to{' '}
              <b className="text-accent">unfinalize</b> a session.
            </h3>
            <h3>
              Try unfinalizing this session and{' '}
              <b className="text-accent">revising</b> the session.
            </h3>
            <h3>
              You may have made a mistake inputting one of the prices or...
            </h3>
            <h3>
              Maybe you guys had an awesome time and you forgot you actually
              tipped 30%!
            </h3>
            <h3>
              The total will update as the information in the session changes.
            </h3>
          </div>
          <div className="divider"></div>
          <div className="bg-base-100 rounded-box p-5 mb-2">
            <h3 className="text-2xl text-secondary font-bold">
              Sahib Indian Cuisine
            </h3>
            <h3>
              You&apos;re out on a company lunch and you run into Derek and his
              coworker.
            </h3>
            <h3>You invite them to eat together and they agree.</h3>
            <h3>
              You pay the bill and everyone besides Derek&apos;s friend has
              marked what they ate.
            </h3>
            <h3>
              They haven&apos;t used this app before and you want to settle the
              bill on the spot.
            </h3>
            <h3>
              You can add them as a <b className="text-accent">guest</b> and
              confirm their items on behalf of them.
            </h3>
            <h3>
              Go ahead and confirm that they had the Chicken Korma and some of
              the naan.
            </h3>
          </div>
        </div>
        <div className="text-lg mb-8">
          <h3>
            If you&apos;re done with that, try{' '}
            <b className="text-accent">creating</b> a new session.
          </h3>
          <h3>
            If you have any receipts lying around, this is a good opportunity!
          </h3>
        </div>
      </section>
    </div>
  );
};

export default DemoPage;
