using Microsoft.EntityFrameworkCore;
using StudentRegistration.Api.Models.Entities;
using System.Collections.Generic;

namespace StudentRegistration.Api.Data.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options) { }
        public DbSet<Student> Students { get; set; }
    }
}
