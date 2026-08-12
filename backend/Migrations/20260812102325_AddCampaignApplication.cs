using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddCampaignApplication : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CampaignApplications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CampaignId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InfluencerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PitchMessage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProposedRate = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CampaignApplications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CampaignApplications_Campaigns_CampaignId",
                        column: x => x.CampaignId,
                        principalTable: "Campaigns",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CampaignApplications_Influencers_InfluencerId",
                        column: x => x.InfluencerId,
                        principalTable: "Influencers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CampaignApplications_CampaignId_InfluencerId",
                table: "CampaignApplications",
                columns: new[] { "CampaignId", "InfluencerId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CampaignApplications_InfluencerId",
                table: "CampaignApplications",
                column: "InfluencerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CampaignApplications");
        }
    }
}
