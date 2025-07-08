export default function Footer() {
  return (
    <div className="mt-10">
      <div className="h-16 bg-gradient-to-r from-indigo-900 to-purple-900 flex items-center justify-center px-4">
        <p className="font-thin text-white text-center">
         To report any bug or issue, kindly drop a mail at{" "}
          <a
            href="mailto:vedanshupadhyay1401@gmail.com"
            className="underline text-blue-200 hover:text-white"
          >
            vedanshupadhyay1401@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}