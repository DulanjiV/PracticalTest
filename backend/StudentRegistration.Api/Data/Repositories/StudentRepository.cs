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

            query = ApplySorting(query, request.SortBy ?? "FirstName", request.SortDescending);

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

        private static IQueryable<Student> ApplySorting(IQueryable<Student> query, string sortBy, bool descending)
        {
            return sortBy.ToLower() switch
            {
                "firstname" => descending ? query.OrderByDescending(s => s.FirstName) : query.OrderBy(s => s.FirstName),
                "lastname" => descending ? query.OrderByDescending(s => s.LastName) : query.OrderBy(s => s.LastName),
                "email" => descending ? query.OrderByDescending(s => s.Email) : query.OrderBy(s => s.Email),
                "mobile" => descending ? query.OrderByDescending(s => s.Mobile) : query.OrderBy(s => s.Mobile),
                "nic" => descending ? query.OrderByDescending(s => s.NIC) : query.OrderBy(s => s.NIC),
                "dateofbirth" => descending ? query.OrderByDescending(s => s.DateOfBirth) : query.OrderBy(s => s.DateOfBirth),
                _ => descending ? query.OrderByDescending(s => s.FirstName) : query.OrderBy(s => s.FirstName)
            };
        }

        public async Task<bool> EmailExistsAsync(string email, int? excludeId = null)
        {
            return await _context.Students.AnyAsync(s =>
                s.Email.ToLower() == email.ToLower() &&
                (!excludeId.HasValue || s.Id != excludeId.Value));
        }
    }
}