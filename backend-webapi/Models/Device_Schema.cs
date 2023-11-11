using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Reservation.Models
{
    public class Device
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Tag { get; set; } // Assuming 'Tag' is the primary key and is an int

        [Required]
        [StringLength(255)] // Assuming there's a max length for Model_Category in the database
        public string Model_Category { get; set; }

        [Required]
        [StringLength(255)] // Assuming there's a max length for Device_Display_Name in the database
        public string Device_Display_Name { get; set; }

        [StringLength(255)] // Adjust string length according to database constraints
        public string Assigned_To { get; set; }

        [StringLength(255)] // Adjust string length according to database constraints
        public string Reserved_NetID { get; set; }

        [StringLength(255)] // Adjust string length according to database constraints
        public string Location { get; set; }

        // Include all other fields from your Device schema
        // ...

        public bool Available { get; set; } // Assuming this is a boolean in your database

        // Maybe include navigation properties for related entities if using Entity Framework????
        // public virtual User AssignedUser { get; set; }
        // public virtual ICollection<DeviceRes> DeviceReservations { get; set; }
    }
}
