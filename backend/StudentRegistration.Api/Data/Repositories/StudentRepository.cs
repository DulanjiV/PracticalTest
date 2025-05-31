using Microsoft.EntityFrameworkCore;
using StudentRegistration.Api.Data.Context;
using StudentRegistration.Api.Models.Entities;
using StudentRegistration.Api.Models.Requests;

namespace StudentRegistration.Api.Data.Repositories
{
    public class StudentRepository: IStudentRepository
    {
        private readonly ApplicationDbContext _context;

        public StudentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<(IEnumerable<Student> Students, int TotalCount)> GetAllAsync(StudentSearchRequest request)
        {
            var query = _context.Students.AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                var searchTerm = request.SearchTerm.ToLower();
                query = query.Where(s =>
                    s.FirstName.ToLower().Contains(searchTerm) ||
                    s.LastName.ToLower().Contains(searchTerm) ||
                    s.Mobile.Contains(searchTerm) ||
                    s.Email.ToLower().Contains(searchTerm) ||
                    s.NIC.Contains(searchTerm) ||
                    (s.Address != null && s.Address.ToLower().Contains(searchTerm)));
            }

            var totalCount = await query.CountAsync();

            var students = await query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            return (students, totalCount);
        }

        public async Task<Student> GetByIdAsync(int id)
        {
            return await _context.Students.FindAsync(id);
        }

        public async Task<Student> CreateAsync(Student student)
        {
            _context.Students.Add(student);
            await _context.SaveChangesAsync();
            return student;
        }

        public async Task<Student> UpdateAsync(Student student)
        {
            _context.Students.Update(student);
            await _context.SaveChangesAsync();
            return student;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
            {
                return false;
            }

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}