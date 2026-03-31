const Header = ({ title }) => {
	return (
	  <header className="bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-20">
		<center>
		  <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
			<h1 className="text-2xl font-bold tracking-tight text-white">
			  {title}
			</h1>
		  </div>
		</center>
	  </header>
	);
  };
  
  export default Header;