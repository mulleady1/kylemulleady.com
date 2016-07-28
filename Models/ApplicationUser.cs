using System.Collections.Generic;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Newtonsoft.Json;

namespace KM.Models
{
 	[JsonObject(MemberSerialization.OptIn)]
    public class ApplicationUser : IdentityUser
    {

		[JsonProperty]
		public override string Id { get; set; }

		[JsonProperty]
		public override string UserName { get; set; }

		[JsonProperty]
        public List<Post> Posts { get; set; }

    }
}
